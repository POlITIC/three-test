import * as spine from "@esotericsoftware/spine-threejs";
import { Mesh, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

let assetManager: spine.AssetManager;
const baseUrl = "./assets/";
const spines = {};
const loader = new GLTFLoader();

const getAssetsManager = () => {
    if (assetManager) {
        return assetManager;
    }

    return (assetManager = new spine.AssetManager(baseUrl));
};

const loadChecker = (resolver: () => void) => {
    const am = getAssetsManager();
    if (!am.isLoadingComplete()) {
        requestAnimationFrame(loadChecker.bind({}, resolver));
        return;
    }

    const spinesLoading = Object.keys(spines).filter((name) => !spines[name]);

    spinesLoading.forEach((name) => {
        const atlas = am.require(`${name}.atlas`);
        const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
        const skeletonJson = new spine.SkeletonJson(atlasLoader);

        skeletonJson.scale = 0.4;
        const skeletonData = skeletonJson.readSkeletonData(
            assetManager.require(`${name}.json`)
        );

        // Create a SkeletonMesh from the data and attach it to the scene
        const skeletonMesh = new spine.SkeletonMesh(
            skeletonData,
            (parameters) => {
                parameters.depthTest = false;
                parameters.alphaTest = 0.5;
            }
        );
        skeletonMesh.state.setAnimation(0, "walk", true);

        // save result
        spines[name] = skeletonMesh;
    });

    resolver();
};

export const loadSpine = async (name: string) => {
    const am = getAssetsManager();

    am.loadText(`${name}.json`);
    am.loadTextureAtlas(`${name}.atlas`);

    // prepare a place in the object
    spines[name] = null;

    return new Promise((res) => {
        requestAnimationFrame(loadChecker.bind({}, res));
    });
};

const glbMeshes = {};

export const loadGLBMesh = (name, onProgress?: () => void): Promise<Mesh> => {
    return new Promise((res, rej) => {
        if (glbMeshes[name]) {
            res(glbMeshes[name]);
            return;
        }

        loader.load(
            `${baseUrl}${name}.glb`,
            (gltf) => {
                gltf.scene.children.forEach((obj) => {
                    glbMeshes[obj.name] = obj;

                    if (obj.name === name) {
                        obj.castShadow = true;
                        res(obj as Mesh);
                    }
                });

                rej(new Error(`No mesh found with the name: ${name}`));
            },
            onProgress,
            function (error) {
                console.error(error);
                rej(error);
            }
        );
    });
};

export const getSpine = (name: string) => spines[name];
