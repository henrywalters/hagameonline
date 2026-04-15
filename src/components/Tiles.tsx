import type { ITile, IAsset } from "@hascape/common";
import { useEffect, useState } from "react";
import { Trash, Pencil } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { API } from "../lib/api";
import { ResourceManager, useForm } from "./Resources";

export function TileForm({api, onCreate}: {api: API<ITile>, onCreate: () => void}) {

    const { values, set, errors, setErrors, error, setError, reset } = useForm({
        name: '',
        isWall: false,
        texture: null as File | null,
        color: null as string | null,
    });

    const submit = async () => {
        setErrors({});
        setError(null);
        const data = new FormData();
        data.set('name', values.name);
        data.set('is_wall', values.isWall ? 'true' : 'false');
        if (values.texture) {
            data.set('texture', values.texture);
        }
        if (values.color) {
            data.set('color', values.color);
        }
        const response = await api.post(data);
        if (response.success) {
            reset();
            onCreate();
        } else {
            setErrors(response.errors ? response.errors : {});
            setError(response.error ? response.error : null);
        }

    }

    return (
        <div>
            <h3 className="text-lg font-bold">Add New Tile</h3>
            <div className="mt-3">
                <label className="" htmlFor="tile_name">Name</label>
                <input className="border ml-2" type="text" value={values.name} id="tile_name" onChange={(e) => set('name', e.target.value)} />
                {
                    'name' in errors &&
                    <p className='text-sm text-red-600'>{errors['name']}</p>
                }
            </div>
            <div className="mt-3">
                <label className="" htmlFor="tile_is_wall">Is Wall?</label>
                <input className="border ml-2" type="checkbox" id="tile_is_wall" checked={values.isWall} onChange={(e) => set('isWall', e.target.checked)} />
                {
                    'is_wall' in errors &&
                    <p className='text-sm text-red-600'>{errors['is_wall']}</p>
                }
            </div>
            <div className="mt-3">
                <label className="" htmlFor="tile_texture">Texture</label>
                <input className="border" type="file" id="tile_texture" onChange={(e) => set('texture', e.target.files?.[0] ?? null)} />
                {
                    'texture' in errors &&
                    <p className='text-sm text-red-600'>{errors['texture']}</p>
                }
            </div>
            <div className="mt-3">
                <label className="" htmlFor="tile_color">Color</label>
                <HexColorPicker color={values.color ?? '#000000'} onChange={(c) => set('color', c)} />
                {
                    'color' in errors &&
                    <p className='text-sm text-red-600'>{errors['color']}</p>
                }
            </div>
            <div className="mt-3">
                <button className="w-full border rounded pr-2 pl-2 mr-2 h-10 hover:text-white hover:bg-blue-600 hover:cursor-pointer" onClick={() => submit()}>Create</button>
                {
                    error &&
                    <p className='text-sm text-red-600'>{error}</p>
                }
            </div>
        </div>
    )
}

export default function Tiles({ token, apiUrl}: {token: string, apiUrl: string}) {

    const api = new API<ITile>(`${apiUrl}/tile`, token);

    return (
        <ResourceManager
            title="Tile Manager"
            api={api}
            columns={['Name', 'Is Wall', 'Texture', 'Color']}
            renderForm={(onCreate) => <TileForm api={api} onCreate={onCreate} />}
            renderRow={(tile, onDelete) => (
                <tr key={tile.id} className='border-b'>
                    <td className='p-1'>{tile.name}</td>
                    <td>{tile.isWall ? 'Yes' : 'No'}</td>
                    <td>{
                        tile.texture && <img className='m-1' src={tile.texture.url} width="50" height="auto" />
                    }</td>
                    <td>{
                        tile.color && <div className='m-1' style={{width: '50px', height: '50px', backgroundColor: tile.color}}></div>
                    }</td>
                    <td>
                        {/* <button className="button warning"><Pencil size={20} /></button> */}
                        <button className="ml-3 button danger" onClick={() => onDelete(tile)}><Trash size={20} /></button>
                    </td>
                </tr>
            )}
        />
    )
}