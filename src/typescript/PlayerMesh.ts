import { Mesh, MeshBasicMaterial } from "three";
import { loadGLBMesh } from "./loading";

export class PlayerMesh extends Mesh {
    constructor() {
        super();
        this.name = "player";
    }

    async init(left, top, scale) {
        const mesh = await loadGLBMesh("tank");

        this.add(mesh);

        mesh.castShadow = true;

        mesh.scale.set(scale * 0.9, scale * 0.9, scale * 0.9);
        mesh.position.set(left * scale, 0, top * scale);

        const p2 = mesh.clone();
        p2.scale.set(scale * 0.9, scale * 0.9, scale * 0.9);
        p2.position.set((left + 1) * scale, 0, top * scale);

        const headMesh = p2.children[1];
        const material = new MeshBasicMaterial({
            color: 0x00dd00,
            // wireframe: true,
        });
        (headMesh as Mesh).material = material;
        this.add(p2);
    }
}
