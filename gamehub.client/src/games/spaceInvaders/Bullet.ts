// Bullet
// - Represents a bullet fired by the player
// - Holds position and movement logic used by the SpaceInvaders game
import type { Position } from "./Player";

export class Bullet {
    position: Position;
    active: boolean;

    constructor(x: number, y: number) {
        this.position = {
            x,
            y,
        };

        this.active = true;
    }

    moveUp() {
        this.position.y--;

        if (this.position.y < 0) {
            this.active = false;
        }
    }

    clone() {
        const newBullet = new Bullet(
            this.position.x,
            this.position.y
        );

        newBullet.active = this.active;

        return newBullet;
    }
}