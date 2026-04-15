import { useEffect, useState } from "react";
import type { API } from "../lib/api";
import { RefreshCcw } from "lucide-react";

export interface ResourceManagerProps<T extends { id: string }> {
    title: string;
    api: API<T>;
    renderForm: (onCreate: () => void) => React.ReactNode;
    renderRow: (item: T, onDelete: (item: T) => void) => React.ReactNode;
    columns: string[];
}

export function ResourceManager<T extends { id: string }>({
  title, api, renderForm, renderRow, columns
}: ResourceManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setError(null);
    setLoading(true);
    const res = await api.getAll();
    if (!res.success) {
      setError(res.error ?? 'Unknown error occurred');
    } else {
      setItems(res.data);
    }
    setLoading(false);
  };

  const removeItem = async (item: T) => {
    setLoading(true);
    await api.delete(item.id);
    await fetchItems();
  };

  useEffect(() => { fetchItems(); }, []);

  return (
    <div className="bg-gray-400 rounded p-3 mb-3">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex mt-3">
        <div className="rounded p-3 bg-white">
          {renderForm(fetchItems)}
        </div>
        <div className="rounded p-3 bg-white w-full ml-3">
          <table className="w-full mb-3">
            <thead className="border-b bg-gray-200">
              <tr className="text-left">
                {columns.map(col => <th key={col} className="p-1">{col}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => renderRow(item, removeItem))}
            </tbody>
          </table>
          <div className='flex mt-auto mt-3'>
              {error && <p className="text-red-600">{error}</p>}
              <button className='button flex ml-auto mb-3' disabled={loading} onClick={() => fetchItems()}>
                {
                  loading && <p>Loading...</p>
                }
                { !loading && <span className='flex'>Refresh <RefreshCcw className='mt-1 ml-2' size={16} /></span> }
                
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export function useForm<T extends Record<string, unknown>>(initial: T) {
    const [values, setValues] = useState<T>(initial);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const set = <K extends keyof T>(key: K, value: T[K]) =>
    setValues(v => ({ ...v, [key]: value }));

    const reset = () => {
    setValues(initial);
    setErrors({});
    setError(null);
    };

    return { values, set, errors, setErrors, error, setError, reset };
}