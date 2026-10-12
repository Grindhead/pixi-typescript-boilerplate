import { startWithAssetRecovery } from "./utils/startup";
import "pixi-spine";
import "./style.css";
import { Application, Assets } from "pixi.js";
import { getSpine } from "./utils/spine-example";
import { createBird } from "./utils/create-bird";
import { attachConsole } from "./utils/attach-console";

const gameWidth = 1280;
const gameHeight = 720;

console.log(
    `%cPixiJS V7\nTypescript Boilerplate%c ${VERSION} %chttp://www.pixijs.com %c❤️`,
    "background: #ff66a1; color: #FFFFFF; padding: 2px 4px; border-radius: 2px; font-weight: bold;",
    "color: #D81B60; font-weight: bold;",
    "color: #C2185B; font-weight: bold; text-decoration: underline;",
    "color: #ff66a1;",
);

const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

window.onload = (): void => {
    startWithAssetRecovery({
        load: loadGameAssets,
        ready: async () => {
            document.body.appendChild(app.view);

            resizeCanvas();

            const birdFromSprite = createBird();
            birdFromSprite.anchor.set(0.5, 0.5);
            birdFromSprite.position.set(gameWidth / 2, gameHeight / 4);

            const spineExample = await getSpine();

            app.stage.addChild(birdFromSprite);
            app.stage.addChild(spineExample);
            app.stage.interactive = true;

            if (VERSION.includes("d")) {
                // if development version
                attachConsole(app.stage, gameWidth, gameHeight);
            }
        },
    });
};

async function loadGameAssets(): Promise<void> {
    const manifest = {
        bundles: [
            {
                name: "bird",
                assets: [
                    {
                        name: "bird",
                        srcs: "./assets/simpleSpriteSheet.json",
                    },
                ],
            },
            {
                name: "pixie",
                assets: [
                    {
                        name: "pixie",
                        srcs: "./assets/spine-assets/pixie.json",
                    },
                ],
            },
        ],
    };

    await Assets.init({ manifest });
    await Assets.loadBundle(["bird", "pixie"]);
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        const scale = Math.min(window.innerWidth / gameWidth, window.innerHeight / gameHeight);
        app.stage.scale.set(scale);
        app.stage.position.set(
            (window.innerWidth - gameWidth * scale) / 2,
            (window.innerHeight - gameHeight * scale) / 2,
        );
    };

    resize();

    window.addEventListener("resize", resize);
}
