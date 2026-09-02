// Shows a login/register button or the user's profile with a dropdown menu based on the authentication state.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { useAuth } from "../../hooks/useAuth";
import "../../css/LoginRegister.css";

export default function LoginRegister() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { user, isLoggedIn, logout } = useAuth();

    const navigate = useNavigate();

    function handleLoginSuccess() {
        setIsOpen(false);
        setIsLogin(true);
    }

    async function handleLogout() {
        await logout();
        setIsProfileOpen(false);
    }

    return (
        <div className="loginRegister">

            {!isLoggedIn && !isOpen && (
                <button
                    className="loginButton"
                    onClick={() => setIsOpen(true)}
                >
                    Login
                </button>
            )}

            {isLoggedIn && (
                <div className="profileContainer">

                    <button
                        className="profileButton"
                        onClick={() =>
                            setIsProfileOpen(!isProfileOpen)
                        }
                    >
                        <span className="profileIcon">👤</span>

                        <span className="profileName">
                            {user?.displayName}
                        </span>

                        <span className="profileArrow">
                            {isProfileOpen ? "▲" : "▼"}
                        </span>
                    </button>

                    {isProfileOpen && (
                        <div className="profileDropdown">

                            <button
                                className="dropdownItem"
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    navigate("/profile");
                                }}
                            >
                                Profile
                            </button>

                            <button
                                className="dropdownItem"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>
                    )}

                </div>
            )}

            {isOpen && !isLoggedIn && (
                <div className="loginPopup">

                    <button
                        className="closeButton"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close login"
                    >
                        ×
                    </button>

                    {isLogin ? (
                        <Login
                            switchMode={() => setIsLogin(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    ) : (
                        <Register
                            switchMode={() => setIsLogin(true)}
                        />
                    )}

                </div>
            )}

        </div>
    );
}