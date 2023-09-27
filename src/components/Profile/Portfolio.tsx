import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

interface Holding {
    date: string;
    id: number;
    shares: number;
    ticker: string;
}

interface PortfolioData {
    _id: string;
    holdings: Holding[];
    last_buy_id: number;
    username: string;
}

const Portfolio: React.FC<{ username: string }> = ({ username }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const tickerRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    const addStockBuy = () => {
        const ticker = tickerRef.current?.value;
        const quantity = quantityRef.current?.value;
        const date = dateRef.current?.value;

        if (ticker && quantity && date) {
            fetch(`${API_URL}/portfolio/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    ticker,
                    quantity,
                    date,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        // Refresh portfolio data after adding
                        // (You can optimize this by updating the state directly)
                        fetchPortfolioData();
                    }
                })
                .catch(err => {
                    setError("Failed to add stock buy.");
                });
        }
    };

    const deleteStockBuy = (buy_id: number) => {
        fetch(`${API_URL}/portfolio/delete-buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                buy_id,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    // Refresh portfolio data after deleting
                    fetchPortfolioData();
                }
            })
            .catch(err => {
                setError("Failed to delete stock buy.");
            });
    };

    const fetchPortfolioData = () => {
        fetch(`${API_URL}/portfolio/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setPortfolio(data);
                }
            })
            .catch(err => {
                setError("Failed to fetch portfolio.");
            });
    };

    const editStockBuy = (buy_id: number, ticker: string, shares: number, date: string) => {
        const newTicker = prompt("Enter new ticker:", ticker) || ticker;
        const newShares = parseInt(prompt("Enter new shares:", shares.toString()) || shares.toString(), 10);
        const newDate = prompt("Enter new date:", date) || date;
    
        fetch(`${API_URL}/portfolio/edit-buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                buy_id,
                ticker: newTicker,
                shares: newShares,
                date: newDate,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                // Refresh portfolio data after editing
                fetchPortfolioData();
            }
        })
        .catch(err => {
            setError("Failed to edit stock buy.");
        });
    };

    useEffect(() => {
        fetch(`${API_URL}/portfolio/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setPortfolio(data);
                }
            })
            .catch(err => {
                setError("Failed to fetch portfolio.");
            });
    }, [username]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!portfolio) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white mt-40 p-8 dark:bg-neutral-800 rounded-xl shadow-lg space-y-6">
            {/* Add Stock Buy Form */}
            {/* Add Stock Buy Form */}
        <div className="flex space-x-4">
            <input ref={tickerRef} placeholder="Ticker" className="p-2 border rounded-md w-1/4 bg-zinc-800 text-zinc-400 placeholder-zinc-600" />
            <input ref={quantityRef} type="number" placeholder="Quantity" className="p-2 border rounded-md w-1/4 bg-zinc-800 text-zinc-400 placeholder-zinc-600" />
            <input ref={dateRef} type="date" className="p-2 border rounded-md w-1/4 bg-zinc-800 text-zinc-400 placeholder-zinc-600" />
            <button onClick={addStockBuy} className="bg-zinc-500 text-white p-2 rounded-md hover:bg-zinc-600 transition duration-150">Add Stock Buy</button>
        </div>
            
            <h2 className="text-2xl mb-4">{portfolio.username} Purchase History</h2>
            
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b-2">Ticker</th>
                        <th className="px-4 py-2 border-b-2">Shares</th>
                        <th className="px-4 py-2 border-b-2">Date Bought</th>
                        <th className="px-4 py-2 border-b-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.holdings.map((holding, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-zinc-500' : ''}>
                            <td className="border px-4 py-2">{holding.ticker}</td>
                            <td className="border px-4 py-2">{holding.shares}</td>
                            <td className="border px-4 py-2">{holding.date}</td>
                            <td className="flex space-x-2">
                                <button onClick={() => editStockBuy(holding.id, holding.ticker, holding.shares, holding.date)} className="bg-zinc-400 text-white p-1 rounded-md hover:bg-zinc-500 transition duration-150">Edit</button>
                                <button onClick={() => deleteStockBuy(holding.id)} className="bg-zinc-500 text-white p-1 rounded-md hover:bg-zinc-600 transition duration-150">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
}

export default Portfolio;
