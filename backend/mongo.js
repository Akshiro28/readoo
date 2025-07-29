import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri);

export const connectToDB = async () => {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db();
};
