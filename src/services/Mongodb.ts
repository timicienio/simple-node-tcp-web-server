import * as mongoDB from 'mongodb';

export interface IMongodb {
  db?: mongoDB.Db;
}

const Mongodb: IMongodb = {};

export async function connectToDatabase() {
  try {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
      process.env.DB_CONN_STRING ?? '',
    );

    await client.connect();

    Mongodb.db = client.db(process.env.DB_NAME);

    console.log(
      `Successfully connected to database: ${Mongodb.db.databaseName}`,
    );
  } catch (err) {
    console.log(err);
  }
}

export default Mongodb;
