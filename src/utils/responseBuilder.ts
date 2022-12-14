import { getReasonPhrase } from 'http-status-codes';
import { Response } from 'types/Response';

const responseBuilder = (
  statusCode: number,
  headers: { [key: string]: string },
  body: string,
): Response => ({
  protocol: 'HTTP/1.1',
  headers: new Map(Object.entries(headers)),
  status: getReasonPhrase(statusCode),
  statusCode,
  body,
});

export default responseBuilder;
