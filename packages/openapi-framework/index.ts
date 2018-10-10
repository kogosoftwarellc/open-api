import { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import {
  addOperationTagToApiDoc,
  allowsCoercionFeature,
  allowsDefaultsFeature,
  allowsFeatures,
  allowsResponseValidationFeature,
  allowsValidationFeature,
  assertRegExpAndSecurity,
  byDefault,
  byDirectory,
  byMethods,
  byRoute,
  byString,
  copy,
  getAdditionalFeatures,
  getMethodDoc,
  getSecurityDefinitionByPath,
  handleFilePath,
  handleYaml,
  injectDependencies,
  METHOD_ALIASES,
  resolveParameterRefs,
  resolveResponseRefs,
  sortApiDocTags,
  sortOperationDocTags,
  toAbsolutePath,
  withNoDuplicates,
} from './src/util';
import {
  OpenAPIFrameworkOperationContext,
  OpenAPIFrameworkArgs,
  OpenAPIFrameworkVisitor,
  IOpenAPIFramework
} from './src/types';
import fsRoutes from 'fs-routes';
import OpenAPIDefaultSetter from 'openapi-default-setter';
import OpenAPISchemaValidator from 'openapi-schema-validator';
import OpenAPIRequestCoercer from 'openapi-request-coercer';
import OpenAPIRequestValidator from 'openapi-request-validator';
import OpenAPIResponseValidator from 'openapi-response-validator';
import OpenAPISecurityHandler from 'openapi-security-handler';

export { OpenAPIFrameworkArgs };
export default class OpenAPIFramework implements IOpenAPIFramework {
  private apiDoc;
  readonly basePath;
  private customFormats;
  private dependencies;
  private errorTransformer;
  private externalSchemas;
  readonly featureType;
  readonly loggingPrefix;
  readonly name;
  private originalApiDoc;
  private paths;
  private pathsIgnore;
  private pathSecurity;
  private routesGlob;
  private routesIndexFileRegExp;
  private securityHandlers;
  private validateApiDoc;
  private validator;

  constructor(protected args = {} as OpenAPIFrameworkArgs){
    this.name = args.name;
    this.featureType = args.featureType;
    this.loggingPrefix = args.name ?
      `${this.name}: ` :
      '';

    [
      {name: 'apiDoc', required: true},
      {name: 'errorTransformer', type: 'function'},
      {name: 'externalSchemas', type: 'object'},
      {name: 'featureType', required: true},
      {name: 'name', required: true},
      {name: 'paths', required: true},
      {name: 'pathSecurity', class: Array, className: 'Array'},
      {name: 'securityHandlers', type: 'object'}
    ].forEach(arg => {
      if (arg.required && !(arg.name in args)) {
        throw new Error(`${this.loggingPrefix}args.${arg.name} is required`);
      }

      if (arg.type && arg.name in args && typeof args[arg.name] !== arg.type) {
        throw new Error(`${this.loggingPrefix}args.${arg.name} must be a ${arg.type} when given`);
      }

      if (arg.class && arg.name in args && !(args[arg.name] instanceof arg.class)) {
        throw new Error(`${this.loggingPrefix}args.${arg.name} must be an instance of ${arg.className} when given`);
      }
    });

    this.originalApiDoc = handleYaml(handleFilePath(args.apiDoc));
    this.apiDoc = copy(this.originalApiDoc);
    this.basePath =  (this.apiDoc.basePath || '').replace(/\/$/, '');
    this.validateApiDoc = 'validateApiDoc' in args ?
        !!args.validateApiDoc :
        true;
    this.validator = new OpenAPISchemaValidator({
      version: (<OpenAPIV3.Document>this.apiDoc).openapi || (<OpenAPIV2.Document>this.apiDoc).swagger,
      extensions: this.apiDoc[`x-${this.name}-schema-extension`]
    });
    this.customFormats = args.customFormats;
    this.dependencies = args.dependencies;
    this.errorTransformer = args.errorTransformer;
    this.externalSchemas = args.externalSchemas;
    this.paths = args.paths;
    this.pathsIgnore = args.pathsIgnore;
    this.pathSecurity = Array.isArray(args.pathSecurity) ?
        args.pathSecurity :
        [];
    this.routesGlob = args.routesGlob;
    this.routesIndexFileRegExp = args.routesIndexFileRegExp;
    this.securityHandlers = args.securityHandlers;
    this.pathSecurity.forEach(assertRegExpAndSecurity.bind(null, this));

    if (this.validateApiDoc) {
      const apiDocValidation = this.validator.validate(this.apiDoc);

      if (apiDocValidation.errors.length) {
        console.error(`${this.loggingPrefix}Validating schema before populating paths`);
        console.error(`${this.loggingPrefix}validation errors`,
            JSON.stringify(apiDocValidation.errors, null, '  '));
        throw new Error(`${this.loggingPrefix}args.apiDoc was invalid.  See the output.`);
      }
    }
  }

  initialize(visitor: OpenAPIFrameworkVisitor) {
    const parameterDefinitions = this.apiDoc.parameters || {};
    const apiSecurityMiddleware = this.securityHandlers &&
                                this.apiDoc.security &&
                                this.apiDoc.securityDefinitions ?
        new OpenAPISecurityHandler({
          securityDefinitions: this.apiDoc.securityDefinitions,
          securityHandlers: this.securityHandlers,
          operationSecurity: this.apiDoc.security,
          loggingKey: `${this.name}-security`
        }) :
        null;

    const paths = [].concat(this.paths);
    let routes = [];
    paths.forEach(pathItem => {
      if (byString(pathItem)) {
        pathItem = toAbsolutePath(pathItem);
        if (!byDirectory(pathItem)) {
          throw new Error(
            `${this.loggingPrefix}args.paths contained a value that was not a path to a directory`
          );
        }
        routes = routes.concat(fsRoutes(pathItem, {
          glob: this.routesGlob,
          indexFileRegExp: this.routesIndexFileRegExp
        })
          .filter(fsRoutesItem => {
            return this.pathsIgnore ? !this.pathsIgnore.test(fsRoutesItem.route) : true;
          })
          .map(fsRoutesItem => {
            return { path: fsRoutesItem.route, module: require(fsRoutesItem.path) };
          })
        );
      } else {
        if (!pathItem.path || !pathItem.module ) {
          throw new Error(
            `${this.loggingPrefix}args.paths must consist of strings or valid route specifications`
          );
        }
        routes.push(pathItem);
      }
    });
    routes = routes.sort(byRoute);

    // Check for duplicate routes
    const dups = routes.filter((v,i,o) => {if(i>0 && v.path === o[i-1].path) return v.path;});
    if (dups.length > 0) {
      throw new Error(
        `${this.loggingPrefix}args.paths produced duplicate urls for "${dups[0].path}"`
      );
    }

    const getApiDoc = () => {
      return copy(this.apiDoc);
    };

    routes.forEach(routeItem => {
      const route = routeItem.path;
      const pathModule = injectDependencies(routeItem.module.default || routeItem.module, this.dependencies);
      // express path params start with :paramName
      // openapi path params use {paramName}
      const openapiPath = route;
      // Do not make modifications to this.
      const originalPathItem = this.originalApiDoc.paths[openapiPath] || {};
      const pathDoc = this.apiDoc.paths[openapiPath] || {};
      const pathParameters = pathDoc.parameters || [];

      // push all parameters defined in the path module to the path parameter list
      if (Array.isArray(pathModule.parameters)) {
        [].push.apply(pathParameters, pathModule.parameters);
      }

      pathDoc.parameters = pathParameters;
      this.apiDoc.paths[openapiPath] = pathDoc;

      Object.keys(pathModule).filter(byMethods).forEach(methodName => {
        // operationHandler may be an array or a function.
        const operationHandler = pathModule[methodName];
        methodName = METHOD_ALIASES[methodName];
        const operationDoc = handleYaml(getMethodDoc(operationHandler)) || pathDoc[methodName];
        const consumes = operationDoc && Array.isArray(operationDoc.consumes) ?
          operationDoc.consumes :
            Array.isArray(this.apiDoc.consumes) ?
            this.apiDoc.consumes :
            [];
        const operationContext: OpenAPIFrameworkOperationContext = {
          additionalFeatures: getAdditionalFeatures(this, this.originalApiDoc,
            originalPathItem, pathModule, operationDoc),
          allowsFeatures: allowsFeatures(this, this.apiDoc, pathModule, pathDoc, operationDoc),
          apiDoc: this.apiDoc,
          basePath: this.basePath,
          consumes,
          features: {},
          methodName,
          methodParameters: [],
          operationDoc,
          operationHandler,
          path: openapiPath,
        };

        if (operationDoc) {
          pathDoc[methodName] = operationDoc;

          if (operationDoc.tags) {
            sortOperationDocTags(operationDoc);
            operationDoc.tags.forEach(addOperationTagToApiDoc.bind(null, this.apiDoc));
          }

          if (operationContext.allowsFeatures) {
            // add features
            if (operationDoc.responses && allowsResponseValidationFeature(this, this.apiDoc,
                  pathModule, pathDoc, operationDoc)) {
              // add response validation feature
              // it's invalid for a method doc to not have responses, but the post
              // validation will pick it up, so this is almost always going to be added.
              const responseValidator = new OpenAPIResponseValidator({
                loggingKey: `${this.name}-response-validation`,
                definitions: this.apiDoc.definitions,
                externalSchemas: this.externalSchemas,
                errorTransformer: this.errorTransformer,
                responses: resolveResponseRefs(this, operationDoc.responses, this.apiDoc, route),
                customFormats: this.customFormats
              });

              operationContext.features.responseValidator = responseValidator;
            }

            const methodParameters = withNoDuplicates(resolveParameterRefs(
              this,
              Array.isArray(operationDoc.parameters) ?
              pathParameters.concat(operationDoc.parameters) :
              pathParameters, parameterDefinitions));
            operationContext.methodParameters = methodParameters;

            if (methodParameters.length) {
              // defaults, coercion, and parameter validation middleware
              if (allowsValidationFeature(this, this.apiDoc, pathModule, pathDoc, operationDoc)) {
                const requestValidator = new OpenAPIRequestValidator({
                  errorTransformer: this.errorTransformer,
                  parameters: methodParameters,
                  schemas: this.apiDoc.definitions,
                  externalSchemas: this.externalSchemas,
                  customFormats: this.customFormats
                });
                operationContext.features.requestValidator = requestValidator;
              }

              if (allowsCoercionFeature(this, this.apiDoc, pathModule, pathDoc, operationDoc)) {
                const coercer = new OpenAPIRequestCoercer({
                  extensionBase: `x-${this.name}-coercion`,
                  loggingKey: `${this.name}-coercion`,
                  parameters: methodParameters
                });

                operationContext.features.coercer = coercer;
              }

              // no point in default feature if we don't have any parameters with defaults.
              if (methodParameters.filter(byDefault).length &&
                  allowsDefaultsFeature(this, this.apiDoc, pathModule, pathDoc, operationDoc)) {
                const defaultSetter = new OpenAPIDefaultSetter({parameters: methodParameters});
                operationContext.features.defaultSetter = defaultSetter;
              }
            }

            let securityFeature;
            let securityDefinition;

            if (this.securityHandlers && this.apiDoc.securityDefinitions) {
              if (operationDoc.security) {
                securityDefinition = operationDoc.security;
              } else if (this.pathSecurity.length) {
                securityDefinition = getSecurityDefinitionByPath(openapiPath, this.pathSecurity);
              }
            }

            if (securityDefinition) {
              pathDoc[methodName].security = securityDefinition;
              securityFeature = new OpenAPISecurityHandler({
                securityDefinitions: this.apiDoc.securityDefinitions,
                securityHandlers: this.securityHandlers,
                operationSecurity: securityDefinition,
                loggingKey: `${this.name}-security`
              });
            } else if (apiSecurityMiddleware) {
              securityFeature = apiSecurityMiddleware;
            }

            if (securityFeature) {
              operationContext.features.securityHandler = securityFeature;
            }
          }
        }

        if (visitor.visitOperation) {
          visitor.visitOperation(operationContext);
        }
      });

      if (visitor.visitPath) {
        visitor.visitPath({
          basePath: this.basePath,
          getApiDoc,
          getPathDoc: () => copy(pathDoc),
        });
      }
    });

    sortApiDocTags(this.apiDoc);

    if (this.validateApiDoc) {
      const apiDocValidation = this.validator.validate(this.apiDoc);

      if (apiDocValidation.errors.length) {
        console.error(`${this.loggingPrefix}Validating schema after populating paths`);
        console.error(`${this.loggingPrefix}validation errors`,
            JSON.stringify(apiDocValidation.errors, null, '  '));
        throw new Error(`${this.loggingPrefix}args.apiDoc was invalid after populating paths.  See the output.`);
      }
    }

    if (visitor.visitApi) {
      visitor.visitApi({
        basePath: this.basePath,
        getApiDoc,
      });
    }
  }
}
