import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../services/authService";
import "./css/ProfileInfo.css";

export default function ProfileInfo() {
    const { user } = useAuth();

    const [displayName, setDisplayName] = useState(user?.displayName ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await updateProfile(
                displayName,
                email,
                currentPassword,
                newPassword
            );

            setMessage("Profile updated successfully.");

            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update profile."
            );
        }
    }

    if (!user) {
        return null;
    }

    return (
        <section className="profileInfo">
            <h2>Profile</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Nickname
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    New password
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave empty to keep current password"
                    />
                </label>

                <label>
                    Current password
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </label>

                <button type="submit">
                    Save changes
                </button>
            </form>

            {message && <p className="profileSuccess">{message}</p>}
            {error && <p className="profileError">{error}</p>}
        </section>
    );
}