import * as net from 'net';
import Router from './Router';
import Mongodb, { IMongodb, connectToDatabase } from '../services/Mongodb';
import parseRequest from '../utils/parseRequest';
import compileResponse from '../utils/compileResponse';
import responseBuilder from '../utils/responseBuilder';

const PORT = 3031;
const IP = '127.0.0.1';
const BACKLOG = 100;

export default class Server {
  router: Router;
  private db: IMongodb;

  constructor() {
    this.router = new Router();
    this.db = Mongodb;
  }

  run() {
    connectToDatabase();

    net
      .createServer()
      .listen(PORT, IP, BACKLOG)
      .on('connection', (socket) =>
        socket.on('data', async (buffer) => {
          const request = parseRequest(buffer.toString());

          const response = await (async () => {
            try {
              return await this.router.getHandler(request)(request, {
                db: this.db,
              });
            } catch (err) {
              return responseBuilder(
                500,
                { 'Content-Type': 'application/json' },
                JSON.stringify({ error: 'Server error' }),
              );
            }
          })();

          socket.write(compileResponse(response));

          socket.end();
        }),
      );
  }
}
