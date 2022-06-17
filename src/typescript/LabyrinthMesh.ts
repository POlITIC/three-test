import * as THREE from "three";
import { Mesh } from "three";
import { PlayerMesh } from "./PlayerMesh";

const config = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const wallWidth = 20;

export class LabyrinthMesh extends Mesh {
    constructor() {
        super();

        this.name = "labyrinth";
        this.createWalls();
        this.createPlayer();
    }

    createWall() {
        const geo = new THREE.BoxGeometry(wallWidth, wallWidth, wallWidth);
        const material = new THREE.MeshBasicMaterial({
            color: 0xaaddff,
            // wireframe: true,
        });

        return new Mesh(geo, material);
    }

    createWalls() {
        config.forEach((row, rowI) => {
            row.forEach((isWall, colI) => {
                if (!isWall) {
                    return;
                }
                const wall = this.createWall();

                wall.position.set(colI * wallWidth, 0, rowI * wallWidth);
                wall.name = `row: ${rowI}, col: ${colI}`;

                this.add(wall);
            });
        });
    }

    createPlayer() {
        const player = new PlayerMesh();

        player.init(1, 1, wallWidth);

        this.add(player);
    }
}
