import { ReactNode, createContext, useEffect, useState } from "react";
import { useLocalStorage } from "../customHooks/useLocalStorage";
import { login, refresh, signUp } from "../api/auth";
import { LoginModal } from "./LoginModal";
export type User = {
    userName: string,
    email: string
}

export type UserWithAuth = {
    authToken: string
} & User
export type userContextType = {
    user: UserWithAuth | null,
    login: (userData: LoginFormData) => Promise<void>,
    signUp: (userData: SignUpFormData) => Promise<void>,
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
export type SignUpFormData = {
    userName: string
} & LoginFormData
export let AuthContext = createContext<userContextType>({
    user: null,
    login: function (userData: LoginFormData): Promise<void> {
        throw new Error("Function not implemented.");
    },
    signUp: function (userData: SignUpFormData): Promise<void> {
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
    let [loginModalIsOpen, setLoginModalIsOpen] = useState<boolean>(!userString);
    useEffect(() => {
        if (userString) {
            setCurrentUser(JSON.parse(userString) as UserWithAuth);
            setLoginModalIsOpen(false)
        }
        else {
            setCurrentUser(null);
            setLoginModalIsOpen(true)
        }
    }, [userString]);

    let onLogin = async function (userData: LoginFormData) {
        try {
            let userString = await login(userData);
            setUserString(userString);
        } catch (error) {
            window.alert(error);
        }
    }

    let onSignUp = async function (userData: SignUpFormData) {
        try {
            let userString = await signUp(userData);
            setUserString(userString);
        } catch (error) {
            window.alert(error);
        }
    }

    let onRefresh = async function () {
        console.log("inside onRefresh")
        try {
            if (loginModalIsOpen) return
            let userString = await refresh(currentUser!);
            setUserString(userString);
        } catch (error) {
            //window.alert(error);
            !loginModalIsOpen && logOut();
        }
    }

    let logOut = function () {
        setUserString(null);
    }

    let value = {
        user: currentUser,
        login: onLogin,
        refresh: onRefresh,
        signUp: onSignUp,
        logOut: logOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <LoginModal show={loginModalIsOpen} handleClose={() => { }} />
        </AuthContext.Provider>
    );
};