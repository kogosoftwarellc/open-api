import {
  IOpenAPIResponseValidator,
  OpenAPIResponseValidatorArgs,
} from 'openapi-response-validator';

export default class CustomResponseValidator
  implements IOpenAPIResponseValidator {
  private args;

  constructor(args: OpenAPIResponseValidatorArgs) {
    this.args = args;
  }

  validateResponse(statusCode: any, response: any) {
    return {
      errors: [],
      message: 'Hello, world!',
    };
  }
}
