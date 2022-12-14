import { ObjectId } from 'mongodb';

export default class Message {
  constructor(public content: string, public id?: ObjectId) {}
}
