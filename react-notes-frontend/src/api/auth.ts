import { LoginFormData, SignUpFormData, User, UserWithAuth } from "../components/AuthProvider";

export let login = async function (userData: LoginFormData) {
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
}

export let refresh = async function (currentUser: UserWithAuth) {
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
}

export let signUp = async function (userData: SignUpFormData) {
    let resp = await fetch('https://localhost:5000/auth/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
    });
    if (resp.status !== 201)
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
}