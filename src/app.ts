import * as dotenv from 'dotenv';
import Message from 'models/Message';
import { ObjectId } from 'mongodb';
import Server from './modules/Server';
import responseBuilder from './utils/responseBuilder';

dotenv.config();

const server = new Server();

server.router

  // .post('/signup', async (req, { db: { db } }) => {
  //   const body: { username: string, passwords: string } = JSON.parse(req.body);

  // })

  .get('/message/:id', async (req, { db: { db } }) => {
    const message = await db
      ?.collection<Message>('message')
      .findOne({ _id: new ObjectId(req.parameters.get('id')) });

    return responseBuilder(
      message ? 200 : 404,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ success: true, message } ?? { success: false }),
    );
  })

  .post('/message', async (req, { db: { db } }) => {
    const { content }: { content: string } = JSON.parse(req.body);
    const insertResult = await db
      ?.collection<Message>('message')
      .insertOne({ content });

    return responseBuilder(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ success: true, id: insertResult?.insertedId }),
    );
  })

  .delete('/message/:id', async (req, { db: { db } }) => {
    const deleteResult = await db
      ?.collection<Message>('message')
      .deleteOne({ _id: new ObjectId(req.parameters.get('id')) });

    return responseBuilder(
      deleteResult?.acknowledged ? 200 : 404,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ success: deleteResult?.acknowledged }),
    );
  });

server.run();
