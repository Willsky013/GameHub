// EnemyBullet
// - Represents a bullet fired by an enemy invader
// - Contains position and simple downward movement
// - clone() returns a copy preserving position and active state
import type { Position } from "./Player";

export class EnemyBullet {
    position: Position;
    active: boolean;

    constructor(x: number, y: number) {
        this.position = {
            x,
            y,
        };

        this.active = true;
    }

    moveDown(gridHeight: number) {
        this.position.y++;

        if (this.position.y >= gridHeight) {
            this.active = false;
        }
    }

    clone() {
        const newBullet = new EnemyBullet(
            this.position.x,
            this.position.y
        );

        newBullet.active = this.active;

        return newBullet;
    }
}