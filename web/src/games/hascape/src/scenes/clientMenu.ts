import { RenderScene } from "hagamets/dist/common/scenes/renderScene.js";
import { OrthographicCamera } from "hagamets/dist/common/components/camera.js";
import type { IGame } from "hagamets/dist/core/interfaces/game.js";
import { Transform } from "hagamets/dist/common/components/transform.js";

export class ClientMenu extends RenderScene {
    constructor(game: IGame) {
        super(game);
    }

    onInitialize(): void {

    }
}