import * as THREE from "three";
// import { getSpine, loadSpine } from "./loading";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { LabyrinthMesh } from "./LabyrinthMesh";
import config from "../config/imagesConfig.json";
import {
    AdditiveBlending,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
} from "three";
import { loadKTX, loadTexture } from "./loading";
import { NormalBlending } from "three/src/constants";
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

    // const light = new THREE.AmbientLight(0x404040); // soft white light
    // scene.add(light);

    // for developer tools
    // @ts-ignore
    window.scene = scene;

    // const labyrinthMesh = new LabyrinthMesh();
    // scene.add(labyrinthMesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const s = 130;
    const planeGeo = new PlaneGeometry();

    // LOADING PNG
    // const coinsPNGTexture = loadTexture("coins");
    // const coinsPNGMaterial = new MeshBasicMaterial({ map: coinsPNGTexture });
    // coinsPNGMaterial.blending = AdditiveBlending;
    // const coinsPMGMesh = new Mesh(planeGeo, coinsPNGMaterial);
    // coinsPMGMesh.scale.set(s, s, s);
    // coinsPMGMesh.position.set(-s, 0, 0);
    // scene.add(coinsPMGMesh);

    // LOADING KTX2
    // const coinsKTXTexture = await loadKTX("coins", renderer);
    // const coinsKTXMaterial = new MeshBasicMaterial({ map: coinsKTXTexture });
    // coinsKTXMaterial.blending = AdditiveBlending;
    // const coinsKTXMesh = new Mesh(planeGeo, coinsKTXMaterial);
    // coinsKTXMesh.scale.set(s, -s, s);
    // coinsKTXMesh.position.set(s, 0, 0);
    // scene.add(coinsKTXMesh);

    config.pngs.forEach((pngConf: { id: string; url: string }, index) => {
        const coinsPNGTexture = loadTexture(pngConf.id);
        const coinsPNGMaterial = new MeshBasicMaterial({
            map: coinsPNGTexture,
        });
        coinsPNGMaterial.blending = AdditiveBlending;
        const coinsPMGMesh = new Mesh(planeGeo, coinsPNGMaterial);
        coinsPMGMesh.scale.set(s, s, s);
        coinsPMGMesh.position.set(0, -s * index, 0);
        scene.add(coinsPMGMesh);
    });

    config.ktx.forEach(async (pngConf: { id: string; url: string }, index) => {
        const coinsKTXTexture = await loadKTX(pngConf.id, renderer);
        const coinsKTXMaterial = new MeshBasicMaterial({
            map: coinsKTXTexture,
        });
        coinsKTXMaterial.blending = AdditiveBlending;
        const coinsKTXMesh = new Mesh(planeGeo, coinsKTXMaterial);
        coinsKTXMesh.scale.set(s, -s, s);
        coinsKTXMesh.position.set(s, -s * index, 0);
        scene.add(coinsKTXMesh);
    });

    // LOADING KTX2 created with toktx
    // const coinsKTX2Texture = await loadKTX("coinsToKTX", renderer);
    // const coinsKTX2Material = new MeshBasicMaterial({map: coinsKTX2Texture});
    // coinsKTX2Material.blending = AdditiveBlending;
    // const coinsKTX2Mesh = new Mesh(planeGeo, coinsKTX2Material);
    // coinsKTX2Mesh.scale.set(s, -s, s);
    // coinsKTX2Mesh.position.set(0, s, 0);
    // scene.add(coinsKTX2Mesh);

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
