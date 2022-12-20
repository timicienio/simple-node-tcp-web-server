import * as tls from 'tls';
import * as fs from 'fs';
import Router from './Router';
import Mongodb, { IMongodb, connectToDatabase } from '../services/Mongodb';
import parseRequest from '../utils/parseRequest';
import compileResponse from '../utils/compileResponse';
import responseBuilder from '../utils/responseBuilder';

const PORT = 3000;

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
};

export default class Server {
  router: Router;
  private db: IMongodb;
  private chunk: string;

  constructor() {
    this.router = new Router();
    this.db = Mongodb;
    this.chunk = '';
  }

  run() {
    connectToDatabase();

    tls
      .createServer(options, (socket) => {
        socket.on('data', async (buffer) => {
          const request = parseRequest(this.chunk + buffer.toString());

          if (
            (Number(request.headers?.get('Content-Length')) ?? 0) >
            request.body.length
          ) {
            // incomplete request
            this.chunk += buffer.toString();
            return;
          }

          const response = await (async () => {
            try {
              return await this.router.getHandler(request)(request, {
                db: this.db,
              });
            } catch (err) {
              return responseBuilder(
                500,
                {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
                JSON.stringify({ error: 'Server error' }),
              );
            }
          })();

          this.chunk = '';

          socket.write(compileResponse(response));

          socket.end();
        });
      })
      .listen(PORT);
  }
}
