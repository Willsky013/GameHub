import { Link } from "react-router-dom"
import LoginRegister from "./LoginRegister/LoginRegister"
import "../css/Header.css"

// Header
// - Top navigation bar with links and login/register control
export default function Header() {
    return (
        <header className="banner">

            <Link className="siteName" to="/">
                Game Corner
            </Link>
        
            <nav className="navButtons">
                <Link className="navButton" to="/">
                    Home
                </Link>
                <h2 className="icon">
                    🕹️
                </h2>
                <Link className="navButton" to="/games">
                    Games
                </Link>
            </nav>

            <div className="loginRegister">
                <LoginRegister />
            </div>

        </header>
  );
}