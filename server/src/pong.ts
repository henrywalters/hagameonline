import {Game} from "hagamets/dist/core/game";
import {PongServerManifest} from "hagamets/dist/demos/pongMultiplayer/server";
import { Clock } from "three";

(() => {

    const tickRate = 50;

    const manifest = new PongServerManifest();

    manifest.server.address.host = "167.99.127.36";
    manifest.server.address.port = 4200;

    const game = new Game(manifest, true);

    const clock = new Clock();

    const tick = () => {

        const start = clock.getElapsedTime();

        game.tick(true);

        const end = clock.getElapsedTime();

        const duration = (end - start) * 1000;

        if (duration > tickRate) {
            console.warn("Server Duration exceeding tickRate");
        };

        const waitFor = duration > tickRate ? 0 : tickRate - duration;

        setTimeout(tick, waitFor);
    }

    tick();

})();