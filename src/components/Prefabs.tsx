import { useState } from "react"
import { API } from "../lib/api"
import type { IPrefab } from "@hascape/common";
import { ResourceManager, useForm } from "./Resources";
import { Download, Trash } from "lucide-react";
import { download } from "../lib/utils";

function PrefabForm({api, onCreate}: {api: API<IPrefab>, onCreate: () => void}) {
    const { values, set, errors, setErrors, error, setError, reset } = useForm({
        name: '',
        data: {},
    });

    const submit = async () => {
        const response = await api.post({
            name: values.name,
            data: values.data,
        });
        if (response.success) {
            reset();
            onCreate();
        } else {
            setErrors(response.errors ?? {});
            setError(response.error ?? null);
        }
    }

    const setData = async (file: File | null) => {
        if (!file) {
            set('data', {});
        } else {
            const data = JSON.parse(await file.text());
            console.log(data);
            set('data', data);
        }
    }

    return (
        <div>
            <h3 className="text-lg font-bold">Add New Prefab</h3>
            <div className="mt-3">
                <label htmlFor="name">Name</label>
                <input className="border ml-2" type="text" id="name" value={values.name} onChange={(e) => set('name', e.target.value)} />
                {
                    errors.name && <p className="text-sm text-red-600">{errors.name}</p>
                }
            </div>
            <div className="mt-3">
                <label className="" htmlFor="file">Entity Data</label>
                <input className="border" type="file" id="file" onChange={(e) => setData(e.target.files?.[0] ?? null)} />
                {
                    'data' in errors &&
                    <p className='text-sm text-red-600'>{errors['data']}</p>
                }
            </div>
            <div className="mt-3">
                <button
                className="w-full border rounded pr-2 pl-2 mr-2 h-10 hover:text-white hover:bg-blue-600 hover:cursor-pointer"
                onClick={submit}
                >
                Create
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    )
}

export default function Prefabs({ token, apiUrl }: {token: string, apiUrl: string}) {
    const api = new API<IPrefab>(`${apiUrl}/prefab`, token);

    const downloadData = (prefab: IPrefab) => {
        download(JSON.stringify(prefab.data, null, 2), prefab.name + '.json', 'application/json');
    }

    return (
        <ResourceManager 
            title="Prefab Manager"
            api={api}
            columns={['name', 'data']}
            renderForm={(onCreate) => <PrefabForm api={api} onCreate={onCreate} />}
            renderRow={(prefab, onDelete) => (
                <tr key={prefab.id} className='border-b'>
                    <td className='p-1'>{prefab.name}</td>
                    <td>
                        <button className='button m-2' onClick={() => downloadData(prefab)}><Download size={16} /></button>
                        {/* <button className="button warning"><Pencil size={20} /></button> */}
                        <button className="ml-3 button danger" onClick={() => onDelete(prefab)}><Trash size={20} /></button>
                    </td>
                </tr>
            )}
        />
    )
}