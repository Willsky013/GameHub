import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook to access the AuthContext
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}