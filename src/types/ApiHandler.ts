import { RawRequest, Request } from 'types/Request';
import { Response } from 'types/Response';
import { IMongodb } from 'services/Mongodb';

export type RawApiHandler = (
  req: RawRequest,
  services: { db: IMongodb },
) => Promise<Response>;

export type RawApiHandlerGenerator = (
  params: Map<string, string>,
) => RawApiHandler;

export type ApiHandler = (
  req: Request,
  services: { db: IMongodb },
) => Promise<Response>;
