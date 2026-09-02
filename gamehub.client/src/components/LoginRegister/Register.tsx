// This component is used to register a new user. It is used in the LoginRegister component.

import { registerUser } from "../../services/authService";
import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";

type RegisterProps = { switchMode: () => void; };

export default function Register({ switchMode }: RegisterProps) {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { login } = useAuth();

    async function handleRegister() {
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const data = await registerUser(
                email,
                password,
                username
            );

            await login(email, password);

            setSuccess(data.message);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Registration failed"
            );
        }
    }

    return (
        <>
            <h2>Register</h2>

            <input type="text" placeholder="Username" value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input type="password" placeholder="Confirm Password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={handleRegister}>
                Register
            </button>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <p>
                Already have an account?

                <button
                    className="switchButton"
                    onClick={switchMode}
                >
                    Login
                </button>
            </p>
        </>
    );
}