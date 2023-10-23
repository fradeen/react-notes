import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
const connectionString = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(connectionString);
let conn;
try {
    conn = await client.connect();
} catch (e) {
    console.error(e);
}
let db = conn!.db("react-notes");
export { db };