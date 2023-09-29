import React, { useRef } from 'react';

interface EditModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: (stock: string, quantity: number, price: number) => void;
    stock: string;
    quantity: number;
    price: number;
}

const EditModal: React.FC<EditModalProps> = ({ show, onClose, onConfirm, stock, quantity, price }) => {
    const stockRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    const handleConfirm = () => {
        onConfirm(stockRef.current!.value, parseFloat(quantityRef.current!.value), parseFloat(priceRef.current!.value));
    }

    if (!show) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity" onClick={onClose}></div>

                <div className="inline-block align-middle bg-gray-900 rounded-lg text-left shadow-2xl transform transition-all w-1/5">
                    <div className="p-6">
                        <h2 className="text-white text-lg font-semibold mb-4">Edit</h2>

                        <label className="block text-gray-400 mb-2" htmlFor="ticker">Ticker</label>
                        <input id="ticker" ref={stockRef} defaultValue={stock} placeholder="Ticker" className="p-2 border border-zinc-400 rounded-md mb-3 w-full focus:border-zinc-500 transition duration-150 text-gray-800" />

                        <label className="block text-gray-400 mb-2" htmlFor="shares">Shares</label>
                        <input id="shares" ref={quantityRef} defaultValue={quantity} type="number" placeholder="Shares" className="p-2 border border-zinc-400 rounded-md mb-3 w-full focus:border-zinc-500 transition duration-150 text-gray-800" />

                        <label className="block text-gray-400 mb-2" htmlFor="price">Price</label>
                        <input id="price" ref={priceRef} defaultValue={price} type="number" placeholder="Price" className="p-2 border border-zinc-400 rounded-md mb-3 w-full focus:border-zinc-500 transition duration-150 text-gray-800" />

                        <div className="flex justify-end mt-4">
                            <button onClick={handleConfirm} className="bg-zinc-400 text-white px-4 py-2 rounded mr-2 hover:bg-zinc-500 transition duration-150 focus:outline-none">Confirm</button>
                            <button onClick={onClose} className="bg-zinc-500 text-white px-4 py-2 rounded hover:bg-zinc-600 transition duration-150 focus:outline-none">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditModal;
