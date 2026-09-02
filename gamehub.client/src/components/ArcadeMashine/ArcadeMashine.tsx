import ArcadeGameCard from "./ArcadeGameCard";
import { useArcadeMachine } from "./ArcadeMachineLogic";

import "./css/ArcadeMachine.css";

import ArcadeMashineImage from "./images/ArcadeMashine.png";
import JoyStickImage from "./images/JoyStick.png";
import ButtonImage from "./images/Button.png";

export default function ArcadeMachine() {
    const {
        selectedGame,
        showHighScore,
        highScore,
        myHighScore,
        user,
        isLoggedIn,
        previousGame,
        nextGame,
        toggleScreen,
        playGame,
    } = useArcadeMachine();

    return (
        <section className="arcadeMachine">

            {/* Cabinet artwork */}
            <img
                src={ArcadeMashineImage}
                alt=""
                className="arcadeMachineImage"
            />

            {/* Game name */}
            <div className="arcadeMarquee">
                {selectedGame?.name ?? "GAMEHUB"}
            </div>

            {/* Screen */}
            <div className="arcadeScreen">
                {selectedGame && (
                    <ArcadeGameCard
                        game={selectedGame}
                        showHighScore={showHighScore}
                        highScore={highScore}
                        myHighScore={myHighScore}
                        myDisplayName={user?.displayName}
                        isLoggedIn={isLoggedIn}
                    />
                )}
            </div>

            {/* Previous button */}
            <button
                className="arcadeButton arcadePrevious"
                onClick={previousGame}
                aria-label="Previous game"
            >
                <img
                    src={ButtonImage}
                    alt=""
                />
            </button>

            {/* High score button */}
            <button
                className="arcadeButton arcadeScore"
                onClick={toggleScreen}
                aria-label="Toggle high score"
            >
                <img
                    src={ButtonImage}
                    alt=""
                />
            </button>

            {/* Next button */}
            <button
                className="arcadeButton arcadeNext"
                onClick={nextGame}
                aria-label="Next game"
            >
                <img
                    src={ButtonImage}
                    alt=""
                />
            </button>

            {/* Joystick */}
            <button
                className="arcadeJoystick"
                onClick={playGame}
                aria-label={
                    selectedGame
                        ? `Play ${selectedGame.name}`
                        : "Play"
                }
            >
                <img
                    src={JoyStickImage}
                    alt=""
                />
            </button>

        </section>
    );
}
