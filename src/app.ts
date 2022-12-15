import * as dotenv from 'dotenv';
import Message from 'models/Message';
import { ObjectId } from 'mongodb';
import Server from './modules/Server';
import responseBuilder from './utils/responseBuilder';

dotenv.config();

const server = new Server();

server.router

  .options('/message', async (_) => {
    return responseBuilder(
      200,
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept',
      },
      JSON.stringify({ success: false }),
    );
  })

  .get('/message', async (_, { db: { db } }) => {
    const message = await db?.collection<Message>('message').find({}).toArray();

    return responseBuilder(
      message ? 200 : 404,
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      JSON.stringify({ success: true, message } ?? { success: false }),
    );
  })

  .options('/message/:id', async (_) => {
    return responseBuilder(
      200,
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, DELETE',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept',
      },
      JSON.stringify({ success: false }),
    );
  })

  .get('/message/:id', async (req, { db: { db } }) => {
    const message = await db
      ?.collection<Message>('message')
      .findOne({ _id: new ObjectId(req.parameters.get('id')) });

    return responseBuilder(
      message ? 200 : 404,
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      JSON.stringify({ success: true, message } ?? { success: false }),
    );
  })

  .post('/message', async (req, { db: { db } }) => {
    // console.log(req);
    const { content, author }: { content: string; author: string } = JSON.parse(
      req.body,
    );
    const insertResult = await db
      ?.collection<Message>('message')
      .insertOne({ content, author });

    return responseBuilder(
      200,
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      JSON.stringify({ success: true, id: insertResult?.insertedId }),
    );
  })

  .delete('/message/:id', async (req, { db: { db } }) => {
    const deleteResult = await db
      ?.collection<Message>('message')
      .deleteOne({ _id: new ObjectId(req.parameters.get('id')) });

    return responseBuilder(
      deleteResult?.acknowledged ? 200 : 404,
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      JSON.stringify({ success: deleteResult?.acknowledged }),
    );
  });

server.run();
