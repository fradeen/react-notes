import express, { Application } from 'express';
import dotenv from 'dotenv';
import { userAuthRoutes } from './routes/users.js';
import { notesRoutes } from './routes/notes.js'
import https from 'https';
import fs from 'fs';
import cors from 'cors';
//For env File 
dotenv.config();

let app: Application = express();
let port = process.env.PORT || 5000;
let corsoptions = {
    exposedHeaders: ['authorization'],
    credentials: true,
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173']
}
app.use(cors(corsoptions));
app.use(express.json())
app.use('/auth', userAuthRoutes);
app.use('/api', notesRoutes)

https
    .createServer(
        // Provide the private and public key to the server by reading each
        // file's content with the readFileSync() method.
        {
            key: fs.readFileSync("./certificates/key.pem"),
            cert: fs.readFileSync("./certificates/cert.pem"),
        },
        app
    ).listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });