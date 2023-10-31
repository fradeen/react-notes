import { LoginFormData, User, UserWithAuth } from "../components/AuthProvider";

export let login = async function (userData: LoginFormData) {
    try {
        let resp = await fetch('https://localhost:5000/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(userData),
        });
        if (resp.status !== 200)
            throw new Error("Something went wrong");
        let authToken = resp.headers.get("authorization");
        if (!authToken)
            throw new Error("Something went wrong");
        let respJson = await resp.json();
        let user = respJson.data as User;
        let userWithAuth: UserWithAuth = {
            ...user,
            authToken: authToken
        }
        return JSON.stringify(userWithAuth);
    } catch (error) {
        window.alert(error);
        return null
    }
}

export let refresh = async function (currentUser: UserWithAuth) {
    try {
        let resp = await fetch('https://localhost:5000/auth/refresh', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (resp.status !== 201)
            throw new Error("Something went wrong");
        let authToken = resp.headers.get("authorization");
        if (!authToken)
            throw new Error("Something went wrong");
        let userWithAuth: UserWithAuth = {
            ...currentUser,
            authToken: authToken
        }
        return JSON.stringify(userWithAuth);

    } catch (error) {
        window.alert(error);
        return null;
    }
}