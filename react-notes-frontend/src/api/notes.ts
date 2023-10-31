import { UserWithAuth } from "../components/AuthProvider";
import { NoteData, RawNote } from "../pages/NoteList";

export let fetchRawNotes = async function (user: UserWithAuth) {
    let resp = await fetch('https://localhost:5000/api/notes/', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user!.authToken}`
        },
        credentials: "include",
    });
    switch (resp.status) {
        case 200: {
            let respJson = await resp.json();
            let notes = respJson as RawNote[];
            return notes;
        }
        case 403: {
            throw new Error("Auth token Expired, refreshing.");
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

export let createNote = async function ({ tags, ...data }: NoteData, user: UserWithAuth) {


    let resp = await fetch("https://localhost:5000/api/notes/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user!.authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ ...data, tagIds: tags.map(tag => tag._id) }),
    })

    switch (resp.status) {
        case 200: {
            return true;
        }
        case 403: {
            throw new Error("Auth token Expired, refreshing.");
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

export let deleteNote = async function (id: string, user: UserWithAuth) {
    let resp = await fetch(`https://localhost:5000/api/notes/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user!.authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ id: id }),
    })
    switch (resp.status) {
        case 200: {
            return true;
        }
        case 403: {
            throw new Error("Auth token Expired, refreshing.");
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

export let updateNote = async function (id: string, { tags, ...data }: NoteData, user: UserWithAuth) {
    let resp = await fetch(`https://localhost:5000/api/notes/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user!.authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ ...data, tagIds: tags.map(tag => tag._id), id: id }),
    })
    switch (resp.status) {
        case 200: {
            return true;
        }
        case 403: {
            throw new Error("Auth token Expired, refreshing.");
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

