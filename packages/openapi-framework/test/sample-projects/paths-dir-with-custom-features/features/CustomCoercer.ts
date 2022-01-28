import {
  IOpenAPIRequestCoercer,
  OpenAPIRequestCoercerArgs,
} from 'openapi-request-coercer';

export default class CustomCoercer implements IOpenAPIRequestCoercer {
  private args;

  constructor(args: OpenAPIRequestCoercerArgs) {
    this.args = args;
  }

  coerce(request: any) {
    return;
  }
}
