// Login
// - Form to authenticate existing users; uses useAuth to perform login and notifies parent on success
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

type LoginProps = { switchMode: () => void; onLoginSuccess: () => void;};

export default function Login({ switchMode, onLoginSuccess }: LoginProps) {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();

    async function handleLogin() {
        setError("");
        setSuccess("");

        try {
            await login(email, password);

            setSuccess("Login successful.");
            onLoginSuccess();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Login failed"
            );
        }
    }

    return (
        <>
            <h2>Login</h2>

            <input type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <p>
                Don't have an account?

                <button
                    className="switchButton"
                    onClick={switchMode}
                >
                    Register
                </button>
            </p>
        </>
    );
}