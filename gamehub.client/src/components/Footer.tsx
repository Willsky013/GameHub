import "../css/Footer.css";

// Footer
// - Presents site footer information and links
export default function Footer() {
    return (
        <footer className="footer">
            <div className="footerContent">

                <div className="footerBrand">
                    <h2>GameHub</h2>
                    <p>Play games. Set scores. Climb the leaderboard.</p>
                </div>

                <div className="footerSection Navigation">
                    <h3>Navigation</h3>

                    <a href="/">Home</a>
                    <a href="/games">Games</a>
                </div>

                <div className="footerSection GitHub">
                    <h3>Project</h3>

                    <a
                        href="https://github.com/Willsky013/GameHub"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub Repository
                    </a>
                </div>

            </div>

            <div className="footerBottom">
                <span>© 2026 GameHub</span>
                <span>School Project</span>
            </div>
        </footer>
    );
}
