import { Player } from "./Player";
// SpaceInvaders Game logic
// - Manages player, invaders, bullets and game loop state for the Space Invaders game
// - Encapsulates collision and movement rules used by the React game component
import { Invader } from "./Invader";
import { Bullet } from "./Bullet";
import { EnemyBullet } from "./EnemyBullet";

export const GRID_WIDTH = 30;
export const GRID_HEIGHT = 25;

export class Game {
    player: Player;
    invaders: Invader[];
    bullet: Bullet | null;

    score: number;
    lives: number;
    gameOver: boolean;
    started: boolean;

    invaderDirection: number;
    invaderMoveInterval: number;
    invaderMoveCounter: number;

    enemyBullets: EnemyBullet[];
    wave: number;
    fireChance: number;
    maxEnemyBullets: number;

    constructor() {
        this.player = new Player();

        this.invaders = [];

        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 8; column++) {
                this.invaders.push(
                    new Invader(
                        5 + column * 2,
                        2 + row * 2
                    )
                );
            }
        }

        this.bullet = null;

        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.started = false;

        this.invaderDirection = 1;
        this.invaderMoveInterval = 5;
        this.invaderMoveCounter = 0;

        this.enemyBullets = [];

        this.wave = 1;
        this.fireChance = 0.10;
        this.maxEnemyBullets = 1;
    }

    start() {
        this.started = true;
    }

    startNewWave() {
        this.invaders = [];

        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 8; column++) {
                this.invaders.push(
                    new Invader(
                        5 + column * 2,
                        2 + row * 2
                    )
                );
            }
        }

        this.enemyBullets = [];

        this.invaderDirection = 1;
        this.invaderMoveCounter = 0;

        this.wave++;

        this.updateWaveDifficulty();
    }

    updateWaveDifficulty() {
        // Invaders move faster every wave.
        this.invaderMoveInterval = Math.max(
            2, 6 - this.wave
        );

        // More enemy bullets can exist as the waves increase.
        this.maxEnemyBullets = Math.min(
            6, 1 + Math.floor((this.wave + 1) / 2)
        );

        // Lower firing chance balances the increasing bullet count.
        this.fireChance = Math.max(
            0.05, 0.11 - this.wave * 0.01
        );
    }

    movePlayerLeft() {
        this.player.moveLeft();
    }

    movePlayerRight() {
        this.player.moveRight(GRID_WIDTH);
    }

    shoot() {
        if (!this.started || this.gameOver) {
            return;
        }

        if (this.bullet !== null) {
            return;
        }

        this.bullet = new Bullet(
            this.player.position.x + 1,
            this.player.position.y - 1
        );
    }

    moveBullet() {
        if (this.bullet === null) {
            return;
        }

        this.bullet.moveUp();

        if (!this.bullet.active) {
            this.bullet = null;
            return;
        }

        for (const invader of this.invaders) {
            if (!invader.alive) {
                continue;
            }

            if (
                invader.position.x === this.bullet.position.x &&
                invader.position.y === this.bullet.position.y
            ) {
                invader.alive = false;
                this.bullet = null;
                this.score += 10;

                break;
            }
        }
    }

    moveInvaders() {
        this.invaderMoveCounter++;

        if (this.invaderMoveCounter < this.invaderMoveInterval) {
            return;
        }

        this.invaderMoveCounter = 0;

        const aliveInvaders = this.invaders.filter(
            (invader) => invader.alive
        );

        if (aliveInvaders.length === 0) {
            this.startNewWave();
            return;
        }

        let shouldMoveDown = false;

        for (const invader of aliveInvaders) {
            if (
                this.invaderDirection === 1 &&
                invader.position.x >= GRID_WIDTH - 1
            ) {
                shouldMoveDown = true;
                break;
            }

            if (
                this.invaderDirection === -1 &&
                invader.position.x <= 0
            ) {
                shouldMoveDown = true;
                break;
            }
        }

        if (shouldMoveDown) {
            this.invaderDirection *= -1;

            for (const invader of aliveInvaders) {
                invader.position.y++;
            }
        } else {
            for (const invader of aliveInvaders) {
                invader.position.x += this.invaderDirection;
            }
        }

        this.checkInvaderReachedPlayer();

        if (!this.gameOver) {
            this.tryEnemyShoot();
        }
    }

    tryEnemyShoot() {
        if (this.enemyBullets.length >= this.maxEnemyBullets) {
            return;
        }

        if (Math.random() > this.fireChance) {
            return;
        }

        const aliveInvaders = this.invaders.filter(
            (invader) => invader.alive
        );

        if (aliveInvaders.length === 0) {
            return;
        }

        const randomInvader =
            aliveInvaders[
            Math.floor(
                Math.random() * aliveInvaders.length
            )
            ];

        const alreadyShootingFromColumn =
            this.enemyBullets.some(
                (bullet) =>
                    bullet.position.x === randomInvader.position.x
            );

        if (alreadyShootingFromColumn) {
            return;
        }

        this.enemyBullets.push(
            new EnemyBullet(
                randomInvader.position.x,
                randomInvader.position.y + 1
            )
        );
    }

    moveEnemyBullet() {
        const remainingBullets: EnemyBullet[] = [];

        for (const enemyBullet of this.enemyBullets) {
            const bullet = enemyBullet.position;
            const player = this.player.position;

            const hitPlayer =
                bullet.y >= player.y - 1 &&
                bullet.x >= player.x &&
                bullet.x < player.x + this.player.width;

            if (hitPlayer) {
                this.lives--;

                if (this.lives <= 0) {
                    this.gameOver = true;
                    this.enemyBullets = [];
                    return;
                }

                this.player.resetPosition();
                continue;
            }

            enemyBullet.moveDown(GRID_HEIGHT);

            if (enemyBullet.active) {
                remainingBullets.push(enemyBullet);
            }
        }

        this.enemyBullets = remainingBullets;
    }

    checkInvaderReachedPlayer() {
        for (const invader of this.invaders) {
            if (!invader.alive) {
                continue;
            }

            if (
                invader.position.y >= this.player.position.y
            ) {
                this.gameOver = true;
                return;
            }
        }
    }

    update() {
        if (!this.started || this.gameOver) {
            return;
        }

        this.moveEnemyBullet();
        this.moveInvaders();
    }

    clone() {
        const newGame = new Game();

        newGame.player = this.player.clone();

        newGame.invaders = this.invaders.map(
            (invader) => invader.clone()
        );

        newGame.enemyBullets = this.enemyBullets.map(
            (bullet) => bullet.clone()
        );

        newGame.bullet =
            this.bullet?.clone() ?? null;

        newGame.score = this.score;
        newGame.lives = this.lives;
        newGame.gameOver = this.gameOver;
        newGame.started = this.started;

        newGame.invaderDirection = this.invaderDirection;
        newGame.invaderMoveInterval = this.invaderMoveInterval;
        newGame.invaderMoveCounter = this.invaderMoveCounter;

        newGame.wave = this.wave;
        newGame.fireChance = this.fireChance;
        newGame.maxEnemyBullets = this.maxEnemyBullets;

        return newGame;
    }
}