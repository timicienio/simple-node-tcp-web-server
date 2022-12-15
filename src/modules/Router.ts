import Api from './Api';

import { RawRequest } from 'types/Request';
import { Response } from 'types/Response';
import { Method } from '../types/Method';
import { ApiHandler } from 'types/ApiHandler';

export default class Router {
  private apis: Api[];

  constructor() {
    this.apis = [];
  }

  options(endpoint: string, handler: ApiHandler) {
    this.apis.push(new Api(endpoint, Method.OPTIONS, handler));
    return this;
  }

  get(endpoint: string, handler: ApiHandler) {
    this.apis.push(new Api(endpoint, Method.GET, handler));
    return this;
  }

  post(endpoint: string, handler: ApiHandler) {
    this.apis.push(new Api(endpoint, Method.POST, handler));
    return this;
  }

  patch(endpoint: string, handler: ApiHandler) {
    this.apis.push(new Api(endpoint, Method.PATCH, handler));
    return this;
  }

  delete(endpoint: string, handler: ApiHandler) {
    this.apis.push(new Api(endpoint, Method.DELETE, handler));
    return this;
  }

  getHandler(req: RawRequest) {
    return (
      (() => {
        const api = this.apis.find((api) => api.match(req));
        const params = api?.getParams(req) ?? new Map();
        return api?.getRawApiHandler(params);
      })() ??
      (() =>
        ({
          protocol: 'HTTP/1.1',
          headers: new Map(),
          status: 'OK',
          statusCode: 404,
          body: `<html><body><h1>404 Not Found</h1></body></html>`,
        } as Response))
    );
  }
}
