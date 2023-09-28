import React, { useRef } from 'react';

interface EditModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: (ticker: string, shares: number, price: number) => void;
    ticker: string;
    shares: number;
    price: number;
}

const EditModal: React.FC<EditModalProps> = ({ show, onClose, onConfirm, ticker, shares, price }) => {
    const tickerRef = useRef<HTMLInputElement>(null);
    const sharesRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    const handleConfirm = () => {
        onConfirm(tickerRef.current!.value, parseFloat(sharesRef.current!.value), parseFloat(priceRef.current!.value));
    }

    if (!show) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
                    <div className="p-4">
                        <input ref={tickerRef} defaultValue={ticker} placeholder="Ticker" className="p-2 border rounded-md mb-2 w-full" />
                        <input ref={sharesRef} defaultValue={shares} type="number" placeholder="Shares" className="p-2 border rounded-md mb-2 w-full" />
                        <input ref={priceRef} defaultValue={price} type="number" placeholder="Price" className="p-2 border rounded-md mb-2 w-full" />
                        
                        <div className="flex justify-end mt-4">
                            <button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Confirm</button>
                            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditModal;
