import type { IMap, IPlayer } from "@hascape/common"
import { API } from "../lib/api"
import { useEffect, useRef, useState } from "react";

import { Client } from "@hascape/client/client";
import { Manifest } from "@hascape/client/manifest";

function ChoosePlayer({api, players, onSelect}: {api: API<IPlayer>, players: IPlayer[], onSelect: (player: IPlayer) => void}) {

    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const createPlayer = async () => {
        setError(null);
        const res = await api.post({
            username,
        });
        if (!res.success) {
            setError(res.error ? res.error : 'Failed to create Player');
        } else {
            onSelect(res.data);
        }
    }

    return (
        <div id="auth-container" className="max-w-md mx-auto p-6">
            <div id="auth-form" className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-xl font-bold mb-6 text-center">Character Selection</h2>
                
                {
                    players.map((player: any) => (
                        <button onClick={() => onSelect(player)} key={player.id} className="border rounded mb-2 hover:bg-blue-600 hover:text-white w-full p-3 hover:cursor-pointer">{player.username}</button>
                   ))
                } 

                <h4 className="text-xl font-bold mb-6 mt-6 text-center">Create New Character</h4>
                <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button 
                    type="submit"
                    onClick={() => createPlayer()}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-3"
                >
                    Create New Player
                </button>
                {
                    error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
                }
            </div>
        </div>
    )
}

function HaScapeGame({player, apiUrl, token}: {player: IPlayer, apiUrl: string, token: string}) {
    const container = useRef<HTMLDivElement>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    const load = async () => {
        Manifest.client!.address.url = import.meta.env.PUBLIC_SERVER_URL;
        Manifest.client!.address.secure = import.meta.env.PUBLIC_SERVER_SECURE == 'true' ? true : false;

        const game = new Client(Manifest, player as any, apiUrl, token, () => {
            window.location.replace('/hascape');
        });

        const canvas = game.renderer.domElement;
        canvas.width = 1080;
        canvas.height = 720;
        canvas.style.margin = 'auto';

        game.resize(1080, 720);

        container.current!.appendChild(canvas);

        game.run();

        setLoaded(true);
    }

    useEffect(() => {
        load();
    }, [])

    return (
        <div>
            {!loaded && <p className='text-white'>Loading HaScape...</p>}
            <div ref={container}></div>
        </div>
    )
}

export default function HaScape({apiUrl, token, playerId}: {apiUrl: string, token: string, playerId: string | null}) {
    const api = new API<IPlayer>(`${apiUrl}/player`, token);

    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [player, setPlayer] = useState<IPlayer | null>();
    const [initialized, setInitialized] = useState<boolean>(false);

    const getPlayers = async () => {
        const res = await api.getAll();
        if (res.success) {
            setPlayers(res.data);
            if (playerId) {
                for (const p of res.data) {
                    if (p.id === playerId) {
                        setPlayer(p);
                    }
                }
            }
        }
        setInitialized(true);
    }

    const onSelectPlayer = async (p: IPlayer) => {
        setPlayer(p);
        const url = new URL(window.location.href);
        url.searchParams.set('id', p.id);
        window.history.pushState(null, '', url);
    }

    useEffect(() => {
        getPlayers();
    }, [])

    return (
        <div>
            {
                (!player && initialized) &&
                <ChoosePlayer api={api} players={players} onSelect={(p) => onSelectPlayer(p)} />
            }
            {
                (player && initialized) &&
                <HaScapeGame player={player} apiUrl={apiUrl} token={token} />
            }
        </div>
    )
}