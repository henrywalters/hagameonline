import { Param, Types } from "hagamets/dist/core/reflection.js";
import { NetMessage, NetMessages } from "hagamets/dist/net/messages.js";

namespace Client {
    export enum Messages {
        Connect,
    }

    export class Connect extends NetMessage {
        type = Messages.Connect;

        @Param({type: Types.String})
        token: string = "";

        @Param({type: Types.Int})
        world: number = 0;
    }
}

namespace Server {
    export enum Messages {
        Connect,
    }

    export class Connect extends NetMessage {
        type = Messages.Connect;

        @Param({type: Types.Int})
        sessionId: number = 0;
    }
}

export const ClientMessages = new NetMessages([
    Client.Connect,
]);

export const ServerMessages = new NetMessages([
    Server.Connect,
]);