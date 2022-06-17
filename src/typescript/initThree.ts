import * as THREE from "three";
// import { getSpine, loadSpine } from "./loading";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { LabyrinthMesh } from "./LabyrinthMesh";
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
    scene.name = "Scene";

    const light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    // for developer tools
    // @ts-ignore
    window.scene = scene;

    const labyrinthMesh = new LabyrinthMesh();
    scene.add(labyrinthMesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // await loadSpine("raptor");
    // const spineMesh = getSpine("raptor");

    renderer.setAnimationLoop(animation);

    // scene.add(spineMesh);

    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    // controls.enableZoom = false;
    // controls.enablePan = false;

    // animation
    function animation(time) {
        // mesh.rotation.x = time / 2000;
        // mesh.rotation.y = time / 1000;

        const now = Date.now() / 1000;
        const delta = now - lastFrameTime;
        lastFrameTime = now;

        // spineMesh.update(delta);

        renderer.render(scene, camera);
    }
};
