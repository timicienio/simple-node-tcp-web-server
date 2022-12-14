import { Method } from './Method';

export interface RawRequest {
  protocol: string;
  method: Method;
  url: string;
  headers: Map<string, string>;
  body: string;
}

export interface Request extends RawRequest {
  parameters: Map<string, string>;
}
