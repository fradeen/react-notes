import express from "express";

const reactNotesRoutes = express.Router();

// This will help us connect to the database
import { client as dbo } from "../db/conn.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

let checkId = async (req, res) => {
    //console.log("in checkid");

    //console.log(req.body.id);
    let isError = false;
    if (!ObjectId.isValid(req.body.id)) {
        isError = true;
        res.json({ status: 400, error: `Invalid ID` });
    }
    //console.log(isError);
    return isError;
}

// This section will help you get a list of all the notes.
reactNotesRoutes.route("/notes").get(async function (req, res) {
    let db_connect = await dbo.db("react-notes");
    try {
        let result = await db_connect
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

// // This section will help you get a single note by id
// reactNotesRoutes.route("/notes/:id").get(async function (req, res) {
//     console.log(req.params.id);
//     if (checkId(req, res))
//         return;
//     console.log(sucess);
//     let db_connect = await dbo.db("react-notes");
//     let myquery = { _id: ObjectId(req.params.id) };
//     try {
//         let result = await db_connect
//             .collection("notes")
//             .findOne(myquery);
//         res.json(result);

//     }
//     catch (e) {
//         console.error(e);
//         throw e;
//     }
// });

// This section will help you create a new note.
reactNotesRoutes.route("/notes/new").post(async function (req, response) {
    let db_connect = await dbo.db("react-notes");
    let myobj = {
        title: req.body.title,
        markdown: req.body.markdown,
        tagIds: req.body.tagIds,
    };
    try {
        let result = await db_connect.collection("notes").insertOne(myobj);
        response.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

// This section will help you update a note by id.
reactNotesRoutes.route("/notes/update").post(async function (req, response) {
    //console.log(req)
    //console.log(req.body);
    if (await checkId(req, response))
        return;
    let db_connect = await dbo.db("react-notes");
    let myquery = { _id: ObjectId(req.body.id) };
    let newvalues = {
        $set: {
            title: req.body.title,
            markdown: req.body.markdown,
            tagIds: req.body.tagIds,
        },
    };
    try {
        let result = await db_connect
            .collection("notes")
            .updateOne(myquery, newvalues);
        console.log("1 note updated");
        response.json(result);
    }

    catch (e) {
        console.error(e);
        throw e;
    }

});

// This section will help you delete a note
reactNotesRoutes.route("/notes/delete").delete(async (req, response) => {
    if (await checkId(req, response))
        return;
    //console.log("in delete")
    let db_connect = await dbo.db("react-notes");
    let myquery = { _id: ObjectId(req.body.id) };
    try {
        let result = await db_connect.collection("notes").deleteOne(myquery)

        console.log("1 note deleted");
        response.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }

});

// This section will help you get a list of all the tags.
reactNotesRoutes.route("/tags").get(async function (req, res) {
    let db_connect = await dbo.db("react-notes");
    try {
        let result = await db_connect
            .collection("tags")
            .find({})
            .toArray();
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

// This section will help you get a single tag by id
// reactNotesRoutes.route("/tags/:id").get(async function (req, res) {
//     if (checkId(req, res))
//         return;
//     let db_connect = await dbo.db("react-notes");
//     let myquery = { _id: ObjectId(req.params.id) };
//     try {
//         let result = await db_connect
//             .collection("tags")
//             .findOne(myquery);
//         res.json(result);

//     }
//     catch (e) {
//         console.error(e);
//         throw e;
//     }
// });

// This section will help you create a new tag.
reactNotesRoutes.route("/tags/new").post(async function (req, response) {
    let db_connect = await dbo.db("react-notes");
    let myobj = {
        label: req.body.label,
    };
    try {
        let result = await db_connect.collection("tags").insertOne(myobj);
        //console.log(result)
        response.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});

// This section will help you update a tags by id.
reactNotesRoutes.route("/tags/update").post(async function (req, response) {

    if (await checkId(req, response))
        return;
    //console.log(req.body)
    let db_connect = await dbo.db("react-notes");
    let myquery = { _id: ObjectId(req.body.id) };
    let newvalues = {
        $set: {
            label: req.body.label,
        },
    };
    //console.log(newvalues);
    try {
        //console.log("in try block")
        let result = await db_connect
            .collection("tags")
            .updateOne(myquery, newvalues);
        //console.log(result)
        //console.log("1 tag updated");
        response.json(result);
    }

    catch (e) {
        console.error(e);
        throw e;
    }

});

// This section will help you delete a tag
reactNotesRoutes.route("/tags/delete").delete(async (req, response) => {
    if (await checkId(req, response))
        return;
    let db_connect = await dbo.db("react-notes");
    let myquery = { _id: ObjectId(req.body.id) };
    try {
        let result = db_connect.collection("tags").deleteOne(myquery)

        //console.log("1 tag deleted");
        response.json(result);
    }
    catch (e) {
        console.error(e);
        throw e;
    }

});

export { reactNotesRoutes };