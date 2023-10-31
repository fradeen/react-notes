import { UserWithAuth } from "../components/AuthProvider";
import { Tag } from "../pages/NoteList";

export let fetchTags = async function (user: UserWithAuth) {
    let resp = await fetch('https://localhost:5000/api/tags/', {
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
            let tags = respJson as Tag[];
            return tags;
        }
        case 403: {
            throw new Error("Auth token Expired, refreshing.");
        }
        default: {
            throw new Error("Something went wrong");
        }
    }
}

export let updateTag = async function (id: string, label: string, user: UserWithAuth) {
    if (!user!.authToken) return
    let resp = await fetch("https://localhost:5000/api/tags/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user!.authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ id: id, label: label }),
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

export let addTag = async function (label: string, user: UserWithAuth) {

    let resp = await fetch("https://localhost:5000/api/tags/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ label: label }),
    })
    switch (resp.status) {
        case 200: {
            let jsonResp = await resp.json()
            return jsonResp.insertedId;
        }
        case 403: {
            throw new Error("Auth token Expired, refreshing.");
        }
        default: {
            throw new Error("Something went wrong");
        }
    }

}

export let deleteTag = async function (id: string, user: UserWithAuth) {
    let resp = await fetch(`https://localhost:5000/api/tags/delete`, {
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