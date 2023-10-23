import express from "express";
import { db } from '../db/conn.js';
import { authenticateRequest, CustomReq } from './users.js'

let notesRoutes = express.Router();

// This section will help you get a list of all the notes.
notesRoutes.get("/notes", authenticateRequest, async function (req: CustomReq, res) {
    try {
        //console.log(req.user);
        let result = await db
            .collection("notes")
            .find({})
            .toArray();
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

export { notesRoutes }