import type { ReactNode } from "react";

export function Modal({title, body, footer, onClose}: {title: string, body: ReactNode, footer?: ReactNode, onClose: () => void}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button className="text-gray-400 hover:text-gray-600" onClick={() => onClose()}>✕</button>
                </div>
                <div>
                    {body}
                </div>
                {
                    footer && 
                        <div className="flex justify-end gap-3 mt-3">
                        {footer}
                    </div>
                }
            </div>
        </div>
    )
}