import { Method } from 'types/Method';
import { RawRequest } from 'types/Request';
import {
  ApiHandler,
  RawApiHandler,
  RawApiHandlerGenerator,
} from 'types/ApiHandler';
import { pathToRegexp } from 'path-to-regexp';
import rawApiHandlerBuilder from '../utils/rawApiHandlerBuilder';

export default class Api {
  private rawHandlerGenerator: RawApiHandlerGenerator;
  private method: Method;
  private paramKeys: Array<{
    name: string;
    prefix: string;
    suffix: string;
    pattern: string;
    modifier: string;
  }>;
  matcher: RegExp;

  constructor(path: string, method: Method, handler: ApiHandler) {
    this.method = method;
    this.rawHandlerGenerator = rawApiHandlerBuilder(handler);

    const keys: Array<{
      name: string;
      prefix: string;
      suffix: string;
      pattern: string;
      modifier: string;
    }> = [];
    this.matcher = pathToRegexp(path, keys);
    this.paramKeys = keys;
  }

  match(req: RawRequest): boolean {
    return this.method === req.method && !!this.matcher.exec(req.url);
  }

  getParams(req: RawRequest): Map<string, string> {
    const matchResult = this.matcher.exec(req.url) ?? [];
    const paramEntries = this.paramKeys.map(
      (item, index) => [item.name, matchResult[index + 1]] as [string, string],
    );

    return new Map(paramEntries);
  }

  getRawApiHandler(params: Map<string, string>): RawApiHandler {
    return this.rawHandlerGenerator(params);
  }
}
