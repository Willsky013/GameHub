// This file defines the AuthProvider component, which manages the authentication state for the application.

import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    getCurrentUser,
    loginUser,
    logoutUser,
} from "../services/authService";

import { AuthContext } from "./AuthContext";

export type User = {
    id: string;
    email: string;
    displayName: string;
};

type AuthProviderProps = {
    children: ReactNode;
};

// AuthProvider component that provides authentication state and functions to its children
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    async function login(email: string, password: string) {
        await loginUser(email, password);

        const currentUser = await getCurrentUser();
        setUser(currentUser);
    }

    async function logout() {
        await logoutUser();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: user !== null,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}