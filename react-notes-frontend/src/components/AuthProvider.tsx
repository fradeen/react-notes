import { ReactNode, createContext, useEffect, useState } from "react";
import { useLocalStorage } from "../customHooks/useLocalStorage";
import { login, refresh } from "../api/auth";
export type User = {
    userName: string,
    email: string
}

export type UserWithAuth = {
    authToken: string
}
export type userContextType = {
    user: UserWithAuth | null,
    login: (userData: LoginFormData) => Promise<void>
    refresh: () => Promise<void>
    logOut: () => void
}

type contextProps = {
    children: ReactNode
}

export type LoginFormData = {
    email: string,
    password: string
}
export let AuthContext = createContext<userContextType>({
    user: null,
    login: function (userData: LoginFormData): Promise<void> {
        throw new Error("Function not implemented.");
    },
    refresh: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    logOut: function (): void {
        throw new Error("Function not implemented.");
    }
});
export let AuthProvider = ({ children }: contextProps) => {
    let [userString, setUserString] = useLocalStorage<string | null>("user");
    let [currentUser, setCurrentUser] = useState<UserWithAuth | null>(null);
    let [refreshInProgress, setRefreshInProgress] = useState<boolean>(false);
    useEffect(() => {
        if (userString) setCurrentUser(JSON.parse(userString) as UserWithAuth)
        else setCurrentUser(null);
    }, [userString]);

    let onLogin = async function (userData: LoginFormData) {
        try {
            let userString = await login(userData);
            setUserString(userString);
        } catch (error) {
            window.alert(error);
        }
    }

    let onRefresh = async function () {
        try {
            if (refreshInProgress) return
            setRefreshInProgress(true);
            let userString = await refresh(currentUser!);
            setUserString(userString);
            setRefreshInProgress(false);
        } catch (error) {
            window.alert(error);
        }
    }

    let logOut = function () {
        setUserString(null);
    }

    let value = {
        user: currentUser,
        login: onLogin,
        refresh: onRefresh,
        logOut: logOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};