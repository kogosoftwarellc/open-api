import {
  IOpenAPIRequestValidator,
  OpenAPIRequestValidatorArgs,
} from 'openapi-request-validator';

export default class CustomRequestValidator
  implements IOpenAPIRequestValidator {
  private args;

  constructor(args: OpenAPIRequestValidatorArgs) {
    this.args = args;
  }

  validateRequest(request: any) {
    return;
  }
}
