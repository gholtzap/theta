import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/globals.css'
import Header from '../components/Header';
import { useUser } from 'contexts/userContext';

const IndexMakerForm = () => {

    const [tickers, setTickers] = useState<string[]>([]);
    const [tickerInput, setTickerInput] = useState('');
    const [indexName, setIndexName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [title, setTitle] = useState('');
    const [percentages, setPercentages] = useState({});
    const [savedIndexes, setSavedIndexes] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const addTicker = () => {
        if (tickerInput && !tickers.includes(tickerInput)) {
            setTickers([...tickers, tickerInput]);
        }
        setTickerInput('');
    }

    const removeTicker = (index: number) => {
        setTickers(tickers.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (tickers.length === 0 || tickers.every(ticker => ticker.trim() === '')) {
            alert('Please add at least one ticker before submitting.')
            return;
        }

        const requestData = {
            tickers: tickers.filter(ticker => ticker.trim() !== ''),
            index_name: indexName,
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'json'
        }

        try {
            const response = await axios.post('http://localhost:5000/beta', requestData, config)
            const base64Image = `data:image/png;base64,${response.data.image}`
            setImageUrl(base64Image)
            setTitle(response.data.title)
            setPercentages(response.data.percentages)
        } catch (error) {
            console.error('There was an error!', error)
        }
    }


    const handleTickerAddition = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tickerInput.trim() !== "") {
            addTicker();
            setTickerInput("");
        }
    }

    const { user } = useUser();

    const handleSaveIndex = async () => {
        setErrorMsg(null);

        if (!user) {
            alert('You must be logged in to save an index.');
            return;
        }

        if (tickers.length === 0 || tickers.every(ticker => ticker.trim() === '')) {
            setErrorMsg('Please input at least 1 ticker.');
            return;
        }

        const requestData = {
            username: user.username,
            indexName: indexName,
            tickers: tickers.filter(ticker => ticker.trim() !== ''),
        }

        try {
            const response = await axios.post('http://localhost:5000/saveIndex', requestData);

            console.log(response.data);

            if (response.data.error) {
                if (response.data.error.includes("An index with this name already exists")) {
                    setErrorMsg('An index with this name already exists.');
                } else {
                    setErrorMsg(response.data.error);
                }
                return;
            }

            alert('Index saved successfully!');
        } catch (error) {
            console.error('Error saving the index', error);

            if (error.response && error.response.data.error) {
                if (error.response.data.error.includes("An index with this name already exists")) {
                    setErrorMsg('An index with this name already exists.');
                } else {
                    setErrorMsg(error.response.data.error);
                }
            } else {
                setErrorMsg('There was an error saving the index. Please try again later.');
            }
        }
    }

    useEffect(() => {
        const fetchSavedIndexes = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:5000/getSavedIndexes?username=${user.username}`);
                    setSavedIndexes(response.data);
                } catch (error) {
                    console.error('Error fetching saved indexes', error);
                }
            }
        }

        fetchSavedIndexes();
    }, [user]);

    const loadSavedIndex = (index: string) => {
        const idx = parseInt(index);
        if (idx >= 0 && savedIndexes[idx]) {
            setSelectedIndex(index);
            setIndexName(savedIndexes[idx].indexName);
            setTickers(savedIndexes[idx].tickers);
        } else {
            setSelectedIndex(null);
            setIndexName('');
            setTickers([]);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white pt-40">
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">

                <h1 className="mb-0 text-5xl font-bold">β</h1>
                <h1 className="mb-8 text-2xl font-bold">Custom Index</h1>



                {/* Index name input */}
                <div className="w-full max-w-md relative rounded-lg mb-8 overflow-hidden border border-zinc-900/30">
                    <input
                        type="text"
                        value={indexName}
                        onChange={(e) => setIndexName(e.target.value)}
                        placeholder="Enter index name"
                        className="w-full px-4 py-2 focus:outline-none text-black"
                    />
                </div>

                {/* Ticker input */}
                <div className="w-full max-w-md relative rounded-lg mb-8 overflow-hidden border border-zinc-900/30">
                    <input
                        type="text"
                        value={tickerInput}
                        onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                        onKeyPress={handleTickerAddition}
                        placeholder="Add a ticker"
                        className="w-full px-4 py-2 focus:outline-none text-black"
                    />
                    <button type="button" onClick={handleSubmit} className="absolute right-0 top-0 bg-white-500 text-white border-none px-6 py-3 scale-150">
                        <img src="double_arrow.svg" alt="Submit" className="w-4 h-4" />
                    </button>
                </div>

                {errorMsg && (
                    <div className="w-full max-w-md mb-4 text-red-500 bg-red-100 p-2 rounded border border-red-400">
                        {errorMsg}
                    </div>
                )}

                {savedIndexes.length > 0 && (
                    <div className="w-full max-w-md mb-8">
                        <label
                            htmlFor="savedIndexes"
                            className="block text-sm font-medium text-white mb-1"
                        >
                            Your Saved Indexes:
                        </label>
                        <select
                            id="savedIndexes"
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-900/30 rounded-lg text-white focus:outline-none focus:border-zinc-600 hover:border-zinc-700"
                            onChange={e => loadSavedIndex(e.target.value)}
                            value={selectedIndex}
                        >
                            <option value="">Select a saved index</option>
                            {savedIndexes.map((index, idx) => (
                                <option key={idx} value={idx}>{index.indexName}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Ticker list */}
                <div className="grid grid-cols-5 gap-4 mb-20">
                    {tickers.map((ticker, index) => (
                        <div key={index} className="w-40 h-10 p-6 m-4 text-white rounded-xl border border-zinc-500 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{ticker}</h2>
                            <button onClick={() => removeTicker(index)} className="btn">X</button>
                        </div>
                    ))}
                </div>

                <div className="w-full flex justify-center mb-4">
                    <button
                        className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 rounded text-white"
                        onClick={handleSaveIndex}
                    >
                        Save Index to Profile
                    </button>
                </div>


                {/* Display results */}
                <div className="w-full flex justify-center">
                    <div className="w-1/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8 auto-rows-max grid-flow-row-dense">
                        {Object.entries(percentages)
                            .sort(([, a], [, b]) => b - a)
                            .map(([ticker, percentage]) => (
                                <div key={ticker} className="mb-4">
                                    <span className="inline-block w-24 text-white">{ticker}:</span>
                                    <div className="bg-white bg-opacity-20 h-6 rounded overflow-hidden inline-block w-3/4 border border-white">
                                        <div
                                            className="h-full bg-white"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {imageUrl && (
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl mb-4 text-center">{title}</h2>
                            <img src={imageUrl} alt="Generated graph" className="w-full mx-auto" />


                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IndexMakerForm;