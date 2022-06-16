import * as THREE from "three";
import { getSpine, loadSpine } from "./loading";

// init
export const initThree = async () => {
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        3000
    );
    camera.position.y = 100;
    camera.position.z = 400;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);

    await loadSpine("raptor");
    const spineMesh = getSpine("raptor");

    mesh.add(spineMesh);

    document.body.appendChild(renderer.domElement);

    // animation

    function animation(time) {
        mesh.rotation.x = time / 2000;
        mesh.rotation.y = time / 1000;

        renderer.render(scene, camera);
    }
};
