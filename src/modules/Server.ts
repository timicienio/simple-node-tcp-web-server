import * as mongoDB from 'mongodb';
import { connectToDatabase } from '../services/Mongodb';

export default class Server {
  collections: { message?: mongoDB.Collection };

  constructor() {
    this.collections = {};
  }

  init() {
    connectToDatabase();
  }
}
