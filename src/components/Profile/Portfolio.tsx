import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

type Holding = {
    ticker?: string;
    stock?: string;
    shares?: number;
    quantity?: number;
    price: number;
    id: number;
};


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
    const priceRef = useRef<HTMLInputElement>(null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);


    const addStockBuy = () => {
        const ticker = tickerRef.current?.value;
        const quantity = quantityRef.current?.value;
        const price = priceRef.current?.value;


        if (ticker && quantity && price) {
            fetch(`${API_URL}/portfolio/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    ticker,
                    quantity,
                    price,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
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

    const deleteSelectedStockBuys = () => {
        // Modify your API endpoint or request structure as needed to support batch delete
        fetch(`${API_URL}/portfolio/delete-buys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                buy_ids: selectedItems,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    // Refresh portfolio data after deleting
                    fetchPortfolioData();
                    setSelectedItems([]); // Clear selected items after delete
                }
            })
            .catch(err => {
                setError("Failed to delete selected stock buys.");
            });
    };


    const fetchPortfolioData = () => {
        fetch(`${API_URL}/portfolio/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    if (data.error === "Portfolio not found for the given username") {
                        // Set the portfolio to an initial empty state
                        setPortfolio({
                            _id: '',
                            username: username,
                            holdings: [],
                            last_buy_id: 0
                        });
                        console.log(portfolio);
                    } else {
                        setError(data.error);
                    }
                } else {
                    setPortfolio(data);
                }
            })
            .catch(err => {
                setError("Failed to fetch portfolio.");
            });
    };


    const editStockBuy = (buy_id: number, ticker: string, shares: number, price: number) => {
        const newTicker = prompt("Enter new ticker:", ticker) || ticker;
        const newShares = parseInt(prompt("Enter new shares:", shares.toString()) || shares.toString(), 10);
        const newPrice = parseFloat(prompt("Enter new price:", price.toString()) || price.toString());
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
                price: newPrice
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



    const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("CSV upload triggered");
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target?.result as string;
                const stocks = parseCSV(content);
                for (const stock of stocks) {
                    await addStockFromCSV(stock.ticker, stock.quantity, stock.price);
                }

                fetchPortfolioData(); // Refresh the portfolio data after adding all stocks
            };
            reader.readAsText(file);
        }
    };

    interface StockData {
        ticker: string;
        quantity: number;
        price: number;
    }



    const parseCSV = (content: string): StockData[] => {
        const lines = content.split("\n");
        const stocks: StockData[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("Symbol")) {
                for (let j = i + 1; j < lines.length; j++) {
                    const data = lines[j].split("\t");
                    if (data.length > 2 && data[0] && !data[0].startsWith("***")) {
                        const ticker = data[0].replace(/"/g, '').trim(); // Remove extra quotes and trim
                        const quantityStr = data[1].replace(/"/g, '').trim(); // Remove extra quotes and trim
                        const quantity = parseInt(quantityStr, 10);
                        const priceStr = data[3].replace(/"/g, '').trim(); // Remove extra quotes and trim
                        const price = parseFloat(priceStr);

                        if (!isNaN(quantity) && !isNaN(price)) { // Ensure quantity and price are valid numbers
                            stocks.push({
                                ticker,
                                quantity,
                                price
                            });
                        }
                    } else {
                        break;
                    }
                }
                break;
            }
        }

        return stocks;
    };

    const addStockFromCSV = async (ticker: string, quantity: number, price: number) => {
        console.log({
            username,
            ticker,
            quantity,
            price,
        });

        const currentPortfolio = await fetch(`${API_URL}/portfolio/${username}`).then(res => res.json());
        const buy_id = (currentPortfolio.last_buy_id || 0) + 1;

        await fetch(`${API_URL}/portfolio/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                ticker,
                quantity,
                price,
                buy_id
            }),
        });
    };

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (event.target.checked) {
            setSelectedItems(prevItems => [...prevItems, id]);
        } else {
            setSelectedItems(prevItems => prevItems.filter(itemId => itemId !== id));
        }
    };




    if (error) {
        return (
            <div>

            </div>
        );
    }

    if (!portfolio) {
        return (
            <div>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }



    return (
        <div className="bg-white mt-40 p-8 dark:bg-neutral-800 rounded-xl shadow-lg space-y-6">
            {/* Add Stock Buy Form */}
            <div className="relative inline-block">
            <label htmlFor="csvUpload" className="cursor-pointer bg-zinc-500 text-white p-2 rounded-md hover:bg-zinc-600 transition duration-150">
                Upload TD Ameritrade CSV
            </label>
            <input 
                type="file" 
                id="csvUpload"
                onChange={handleCSVUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
        </div>
        <div className="mt-2 text-sm" id="fileName"></div>
            <div className="flex space-x-4">
                
                <input ref={tickerRef} placeholder="Ticker" className="p-2 border rounded-md w-1/4 bg-zinc-800 text-zinc-400 placeholder-zinc-600" />
                <input ref={quantityRef} type="number" placeholder="Quantity" className="p-2 border rounded-md w-1/4 bg-zinc-800 text-zinc-400 placeholder-zinc-600" />
                <input ref={priceRef} type="number" placeholder="Price" className="p-2 border rounded-md w-1/4 bg-zinc-800 text-zinc-400 placeholder-zinc-600" />

                <button onClick={addStockBuy} className="bg-zinc-500 text-white p-2 rounded-md hover:bg-zinc-600 transition duration-150">Add Stock Buy</button>
            </div>

            {error ? (
                <div className="text-red-500 mb-4">{error}</div>
            ) : (
                portfolio && portfolio.holdings.length > 0 ? (
                    <>
                        <h2 className="text-2xl mb-4">{portfolio.username} Purchase History</h2>
                        <button onClick={deleteSelectedStockBuys} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-150">Delete Selected</button>

                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b-2">
                                        <input
                                            type="checkbox"
                                            onChange={e => e.target.checked ? setSelectedItems(portfolio.holdings.map(h => h.id)) : setSelectedItems([])}
                                        />
                                    </th>
                                    <th className="px-4 py-2 border-b-2">Ticker</th>
                                    <th className="px-4 py-2 border-b-2">Shares</th>
                                    <th className="px-4 py-2 border-b-2">Price Bought</th>

                                    <th className="px-4 py-2 border-b-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.holdings.map((holding, index) => (

                                    <tr key={index} className={index % 2 === 0 ? 'bg-zinc-500' : ''}>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(holding.id)}
                                                onChange={e => handleSelect(e, holding.id)}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">{holding.ticker || holding.stock}</td>
                                        <td className="border px-4 py-2">{holding.shares || holding.quantity}</td>



                                        <td className="border px-4 py-2">${typeof holding.price === 'number' ? holding.price.toFixed(2) : holding.price}
                                        </td>


                                        <td className="flex space-x-2">
                                            <button
                                                onClick={() => editStockBuy(holding.id, holding.stock ?? "", holding.quantity ?? 0, holding.price)}
                                                className="bg-zinc-400 text-white p-1 rounded-md hover:bg-zinc-500 transition duration-150"
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteStockBuy(holding.id)} className="bg-zinc-500 text-white p-1 rounded-md hover:bg-zinc-600 transition duration-150">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div>Loading...</div>
                )
            )}
        </div>
    );

}

export default Portfolio;
