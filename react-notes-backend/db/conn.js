import { MongoClient } from 'mongodb';
const client = new MongoClient("mongodb://localhost:27017");
var connectToServer = async () => {
    try {
        await client.connect()
        await client.db("react-notes");
        console.log("connected to db");
    }
    catch (e) {
        console.error(e);
    }
}

export { connectToServer, client };