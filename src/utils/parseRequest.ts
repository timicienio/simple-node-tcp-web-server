import divideStringOn from './divideStringOn';
import { RawRequest } from 'types/Request';
import { Method } from '../types/Method';

const parseRequest = (s: string): RawRequest => {
  // console.log('s\n', s);
  const [firstLine, rest] = divideStringOn(`${s}`, '\r\n');
  const [method, url, protocol] = firstLine.split(' ', 3);
  const [headers, body] = divideStringOn(rest, '\r\n\r\n');
  // console.log('\n\n\ns:', s, '\n\nRest:', rest, '\nHeaders:', headers);

  const parsedHeaders = headers.split('\r\n').reduce((map, header) => {
    const [key, value] = divideStringOn(header, ': ');
    return map.set(key, value);
  }, new Map());

  return {
    protocol,
    method: Method[method as keyof typeof Method],
    url,
    headers: parsedHeaders,
    body,
  };
};

export default parseRequest;
