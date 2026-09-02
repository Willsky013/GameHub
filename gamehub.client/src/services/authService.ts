// This file contains functions to interact with the authentication API.

// It provides functions for user registration, login, logout, and profile management.
export async function registerUser(
    email: string,
    password: string,
    displayName: string
) {
    const response = await fetch("/api/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                displayName,
            }),
        }
    );

    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", text);

    if (!response.ok) {
        throw new Error(
            `Registration failed (${response.status}): ${text}`
        );
    }

    return text ? JSON.parse(text) : null;
}

// Logs in a user with the provided email and password.
export async function loginUser(
    email: string,
    password: string
) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const text = await response.text();

    if (!response.ok) {
        let message = "Login failed";

        try {
            const data = JSON.parse(text);
            message = data.message || message;
        } catch {
            // Response wasn't JSON
        }

        throw new Error(message);
    }

    return text ? JSON.parse(text) : null;
}

// Fetches the current logged-in user's information from the API.
export async function getCurrentUser()
{
    const response = await fetch("/api/auth/me", {
        credentials: "include",
    });

    if (!response.ok) {
        return null;
    }

    return await response.json();
}

// Logs out the current user by sending a POST request to the logout endpoint.
export async function logoutUser() {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Logout failed");
    }

    return await response.json();
}

// Type definition for the response returned after updating the user's profile.
export type UpdateProfileResponse = {
    message: string;
    displayName: string;
    email: string;
};

// Updates the user's profile information, including display name, email, and password.
export async function updateProfile(
    displayName: string,
    email: string,
    currentPassword: string,
    newPassword: string
) {
    const response = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            displayName,
            email,
            currentPassword,
            newPassword: newPassword || null,
        }),
    });

    const text = await response.text();

    if (!response.ok) {
        let message = "Failed to update profile.";

        try {
            const data = JSON.parse(text);
            message = data.message || message;
        } catch {
            // Ignore invalid JSON
        }

        throw new Error(message);
    }

    return JSON.parse(text);
}