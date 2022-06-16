import * as spine from "@esotericsoftware/spine-threejs";
import * as THREE from "three";

let assetManager: spine.AssetManager;
const baseUrl = "./assets/";
const spines = {};

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

export const getSpine = (name: string) => spines[name];
