import { Response } from 'types/Response';

const compileResponse = (r: Response): string => `${r.protocol} ${
  r.statusCode
} ${r.status}
${Array.from(r.headers)
  .map((kv) => `${kv[0]}: ${kv[1]}`)
  .join('\r\n')}

${r.body}`;

export default compileResponse;
