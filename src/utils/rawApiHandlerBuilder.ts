import { IMongodb } from 'services/Mongodb';
import { ApiHandler } from 'types/ApiHandler';
import { RawRequest } from 'types/Request';

const rawApiHandlerBuilder =
  (handler: ApiHandler) =>
  (parameters: Map<string, string>) =>
  async (rawReq: RawRequest, services: { db: IMongodb }) =>
    await handler({ ...rawReq, parameters }, services);

export default rawApiHandlerBuilder;
