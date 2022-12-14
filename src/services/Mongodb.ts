import * as mongoDB from 'mongodb';

export const collections: { message?: mongoDB.Collection } = {};

export async function connectToDatabase() {
  try {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
      process.env.DB_CONN_STRING ?? '',
    );

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const gamesCollection: mongoDB.Collection = db.collection(
      process.env.GAMES_COLLECTION_NAME ?? '',
    );

    collections.message = gamesCollection;

    console.log(
      `Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}`,
    );
  } catch (err) {
    console.log(err);
  }
}
