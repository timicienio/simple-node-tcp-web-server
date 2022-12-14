import * as dotenv from 'dotenv';
import Server from 'modules/Server';

dotenv.config();

const server = new Server();

server.init();
