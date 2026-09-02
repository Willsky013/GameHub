// HomePage
// - Landing page that displays the arcade machine and the Hall of Fame
import ArcadeMachine from "../components/ArcadeMashine/ArcadeMashine";
import HallOfFame from "../components/HallOfFame";
import "../css/HomePage.css"

export default function HomePage() {
    return (
        <main className="homePage">
            <section className="homeHero">
                <ArcadeMachine />

                <HallOfFame />
            </section>
        </main>
    );
}
