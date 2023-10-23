import express, { Application } from 'express';
import dotenv from 'dotenv';
import { userAuthRoutes } from './routes/users.js';
import { notesRoutes } from './routes/notes.js'
import https from 'https';
import fs from 'fs';
//For env File 
dotenv.config();

let app: Application = express();
let port = process.env.PORT || 5000;
app.use(express.json())
app.use(userAuthRoutes);
app.use(notesRoutes)

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