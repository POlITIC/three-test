import * as THREE from "three";
import { getSpine, loadSpine } from "./loading";

let lastFrameTime = Date.now() / 1000;

// init
export const initThree = async () => {
    // for developer tools
    window.THREE = THREE;

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        3000
    );
    camera.position.y = 100;
    camera.position.z = 400;

    const scene = new THREE.Scene();

    // for developer tools
    // @ts-ignore
    window.scene = scene;

    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    await loadSpine("raptor");
    const spineMesh = getSpine("raptor");

    renderer.setAnimationLoop(animation);

    scene.add(spineMesh);

    document.body.appendChild(renderer.domElement);

    let lastTime = Date.now();

    // animation
    function animation(time) {
        mesh.rotation.x = time / 2000;
        mesh.rotation.y = time / 1000;

        const now = Date.now() / 1000;
        const delta = now - lastFrameTime;
        lastFrameTime = now;

        spineMesh.update(delta);

        renderer.render(scene, camera);
    }
};
