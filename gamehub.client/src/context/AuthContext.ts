// This file contains the context for authentication in the application. It provides the current user, login and logout functions, and loading state.

import { createContext } from "react";
import type { User } from "./AuthProvider";

type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);