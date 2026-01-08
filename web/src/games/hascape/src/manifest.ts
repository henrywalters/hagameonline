import type { IManifest } from "hagamets/dist/core/interfaces/manifest.js";
import { Renderer } from "hagamets/dist/common/systems/renderer.js";
import { UI } from "hagamets/dist/common/systems/ui.js";
import RunescapeFont from "../assets/fonts/RuneScape_Regular.json";
import { ClientMenu } from "./scenes/clientMenu";
import type { FontData } from "three/examples/jsm/Addons.js";
import ClientMenuData from "./../assets/scenes/client_menu.json";

export const ClientManifest: IManifest = {
    systems: [
        Renderer,
        UI
    ],
    components: [],
    scripts: [],
    scenes: {
        menu: {
            data: ClientMenuData,
            ctr: ClientMenu,
        }
    },
    assets: {
        fonts: [
            {
                name: 'runescape',
                data: RunescapeFont as unknown as FontData,
            }
        ]
    },
    startScene: "menu"
}

export const ServerManifest: IManifest = {
    systems: [],
    components: [],
    scripts: [],
    scenes: {},
    assets: {},
    startScene: ""
}