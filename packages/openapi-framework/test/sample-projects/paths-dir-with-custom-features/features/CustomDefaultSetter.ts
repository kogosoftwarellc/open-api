import {
  IOpenAPIDefaultSetter,
  OpenAPIDefaultSetterArgs,
} from 'openapi-default-setter';
import { OpenAPI } from 'openapi-types';

export default class CustomDefaultSetter implements IOpenAPIDefaultSetter {
  private args;

  constructor(args: OpenAPIDefaultSetterArgs) {
    this.args = args;
  }

  handle(request: OpenAPI.Request) {
    return;
  }
}
