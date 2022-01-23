import {
  IOpenAPISecurityHandler,
  OpenAPISecurityHandlerArgs,
} from 'openapi-security-handler';

export default class CustomSecurityHandler implements IOpenAPISecurityHandler {
  private args;

  constructor(args: OpenAPISecurityHandlerArgs) {
    this.args = args;
  }

  handle(request: any) {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
