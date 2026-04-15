import type { IMap, ITile } from "@hascape/common";
import { API, type Result } from "../lib/api";
import { useEffect, useRef, useState } from "react";
import { TileForm } from "./Tiles";

import { Game } from "hagamets/dist/core/game.js";
import { EditorRuntime, EditorManifest, TOOL_TYPES, ToolType } from "@hascape/client/editor";
import { RefreshCcw } from "lucide-react";

interface SidebarProps {
    api: API<ITile>;
    mapApi: API<IMap>;
}

const width = 1080;
const height = 720;
const game = new Game(EditorManifest);
game.resize(width, height);
const runtime = game.currentScene! as EditorRuntime;

function MapPicker({maps, onClose, setMap}: {maps: IMap[], onClose: () => void, setMap: (map: IMap) => void}) {

    const [selectedMap, setSelectedMap] = useState<IMap>(maps[0]);

    const selectMap = () => {
        if (!selectedMap) return;
        setMap(selectedMap);
        onClose();
    }

    const chooseMap = (id: string) => {
        for (const map of maps) {
            if (map.id === id) {
                setSelectedMap(map);
            }
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Map Selector</h2>
                    <button className="text-gray-400 hover:text-gray-600" onClick={() => onClose()}>✕</button>
                </div>
                <div>
                    <h1 className='text-lg text-bold'>Select a Map</h1>
                    <select className='input p-1 border w-full' onChange={(e) => chooseMap(e.target.value)}>
                        {maps.map((map) => (
                            <option key={map.id} value={map.id}>{map.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-3 mt-3">
                    <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => onClose()}>Cancel</button>
                    {selectedMap && <button className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg" onClick={() => selectMap()}>Select Map</button>}
                </div>

            </div>
        </div>
    )
}

function Sidebar({api, mapApi}: SidebarProps) {

    const [maps, setMaps] = useState<IMap[]>([]);
    const [map, setMap] = useState<IMap | null>(null);
    const [tiles, setTiles] = useState<ITile[]>([]);
    const [type, setType] = useState<ToolType>(ToolType.TilePlace);
    const [name, setName] = useState<string>('');
    const [defaultMap, setDefaultMap] = useState<boolean>(false);
    const [tile, setTile] = useState<string | null>(null);
    const [radius, setRadius] = useState<number>(1);
    const [selectingMap, setSelectingMap] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [addingTile, setAddingTile] = useState<boolean>(false);

    const typeSelect = (t: ToolType) => {
        setType(t);
        runtime.setTool(t);
    }

    const tileSelect = (t: string | null) => {
        console.log("Selected: ", t);
        setTile(t);
        runtime.setTile(t);
    }

    const getTiles = async () => {
        const res = await api.getAll();
        if (!res.success) {
            console.error(res.error);
            setTiles([]);
        } else {
            runtime.setTiles(tiles);
            setTiles(res.data);
            console.log("Set Tiles");
            if (res.data.length === 0) {
                tileSelect(null);
            } else if (!tile || !res.data.find((el) => el.name === tile)) {
                tileSelect(res.data[0].name);
            }
        }
    }

    const getMaps = async () => {
        const res = await mapApi.getAll();
        if (res.success) {
            console.log(res.data);
            setMaps(res.data);
        }
    }

    const radiusSet = (r: number) => {
        setRadius(r);
        runtime.setRadius(r);
    }

    const newMap = () => {
        setMap(null);
        setName('');
        runtime.clearMap();
    }

    const selectMap = (map: IMap) => {
        setName(map.name);
        setMap(map);
        setDefaultMap(map.defaultMap);
        runtime.loadMap(map);
    }

    const saveMap = async () => {
        setError(null);
        setSuccess(null);

        const data = runtime.saveMap();
        let res: Result<IMap>;
        if (map) {
            res = await mapApi.put(map.id, {
                name,
                data,
                default_map: defaultMap,
            })
        } else {
            res = await mapApi.post({
                name,
                data,
                default_map: defaultMap,
            });
        }

        if (res.success) {
            await getMaps();
            setSuccess('Saved Map!');
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
            setMap(res.data);
        } else {
            setError(res.error ? res.error : 'Failed to save map');
        }
    }

    useEffect(() => {
        getTiles();
        getMaps();
    }, [])

    useEffect(() => {
        runtime.setTiles(tiles);
    }, [tiles])

    return (
        <div className="border p-3 bg-white mr-3" id="ui">
            {
                selectingMap && <MapPicker maps={maps} onClose={() => setSelectingMap(false)} setMap={selectMap}/>
            }
            <div>
                {
                    maps.length > 0 && 
                    <button className='button w-full mb-3' onClick={() => setSelectingMap(true)}>Open Map</button>
                }
                {
                    map &&
                    <button className='button w-full' onClick={() => newMap()}>New Map</button>
                }
                <label>Map Name</label>
                <br />
                <input className='border p-1 w-full' type='text' value={name} onChange={(e) => setName(e.target.value)}/>
                <label htmlFor='defaultMap'>Default Map?</label>
                <input className='ml-2' type='checkbox' checked={defaultMap} id='defaultMap' onChange={(e) => {setDefaultMap(e.target.checked)}} />
                <br />
                <label>Tool Type</label>
                <br />
                <select className="border p-1 w-full" onChange={(e) => {typeSelect(parseInt(e.target.value) as ToolType)}}>
                    {
                        TOOL_TYPES.map((option) => (
                            <option value={option.type} key={option.type}>{option.label}</option>
                        ))
                    }
                </select>
            </div>
            {
                (type === ToolType.TileFill || type === ToolType.TilePlace) && (
                    <div>
                        <div>
                            <div className='flex'>
                                <label className='fill'>Tile Type</label>
                                <button className='ml-3' onClick={() => getTiles()}><RefreshCcw size={16}/></button>
                            </div>
                            <select className="border p-1 w-full" onChange={(e) => {tileSelect(e.target.value)}}>
                                {
                                    tiles.map((option) => (
                                        <option value={option.name} key={option.id}>{option.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <label>Radius</label>
                            <br />
                            <div className='flex justify-evenly'>
                                {
                                    [1, 2, 3, 4, 5, 6].map((r) => 
                                        <button key={r} className={'button ' + (radius === r ? ' border-blue-600 text-blue-600' : '')} onClick={(e) => radiusSet(r)}>{r}</button>
                                    )
                                }
                                
                            </div>
                        </div>
                    </div>
                )
            }
            <div>
                {
                    addingTile && (
                        <div>
                            <button className='button w-full mt-3' onClick={() => setAddingTile(false)}>Cancel</button>
                            <div className='border rounded p-3 mt-3'>
                                <TileForm api={api} onCreate={() => {setAddingTile(false); getTiles()}}/>
                            </div>
                        </div>
                    )
                }
                {
                    !addingTile && <button className='button w-full mt-3' onClick={() => setAddingTile(true)}>Add Tile</button>
                }
                
            </div>

            <div>
                <button className='button success w-full mt-3' onClick={() => saveMap()}>Save Map</button>
            </div>

            {
                success && <p className='text-green-600 text-sm'>{success}</p>
            }
            {
                error && <p className='text-red-600 text-sm'>{error}</p>
            }
            
        </div>
    )
}

function Editor() {

    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("Refreshing Game");
        container.current?.appendChild(game.renderer.domElement);
        game.run();
        return () => {
            container.current?.removeChild(game.renderer.domElement);
            game.stop();
        }
    }, [])

    return (
        <div>
            <div ref={container}/>
        </div>
    )
}

export function MapEditorPage({apiUrl, token}: {apiUrl: string, token: string}) {
    const api = new API<ITile>(`${apiUrl}/tile`, token);
    const mapApi = new API<IMap>(`${apiUrl}/map`, token);

    return (
        <div>
            <div className='flex'>
                <Sidebar api={api} mapApi={mapApi} />
                <Editor />
            </div>
        </div>

    )
}