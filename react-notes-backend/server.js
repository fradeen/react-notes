import express from "express";
import cors from "cors";
import { connectToServer, client } from "./db/conn.js";
import { reactNotesRoutes } from "./routes/notesRouter.js"
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(reactNotesRoutes);

app.listen(port, () => {
    connectToServer();
})
