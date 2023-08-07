import React, { useState } from 'react';
import axios from 'axios';
import '../styles/globals.css'
import Header from '../components/Header';


const IndexMakerForm = () => {

    const [tickers, setTickers] = useState<string[]>([]);
    const [tickerInput, setTickerInput] = useState('');
    const [indexName, setIndexName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [title, setTitle] = useState('');
    const [percentages, setPercentages] = useState({});


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
            setTitle(response.data.title)  // set the title
            setPercentages(response.data.percentages)  // set the percentages

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

                {/* Ticker list */}
                <div className="w-3/4 flex flex-wrap gap-2 mb-8">
                    {tickers.map((ticker, index) => (
                        <div key={index} className="w-40 h-10 p-6 m-4 text-white rounded-xl border border-zinc-500 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{ticker}</h2>
                            <button onClick={() => removeTicker(index)} className="btn">X</button>
                        </div>
                    ))}
                </div>

                {/* Display results */}


                <div className="w-full flex justify-center">

                    <div className="w-1/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8 auto-rows-max grid-flow-row-dense">
                        {Object.entries(percentages)
                            .sort(([, a], [, b]) => b - a)  // sort in descending order
                            .map(([ticker, percentage]) => (
                                <div key={ticker} className="mb-4">
                                    <span className="inline-block w-24 text-white">{ticker}:</span>
                                    <div className="bg-white bg-opacity-20 h-6 rounded overflow-hidden inline-block w-3/4 border border-white">
                                        <div
                                            className="h-full bg-white"
                                            style={{ width: `${percentage}%` }}  // scale the inner div by the percentage
                                        ></div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {imageUrl && (
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl mb-4 text-center">{title}</h2>
                            <img src={imageUrl} alt="Generated graph" className="w-1.5 md:w-1 lg:w-2/3 mx-auto" />
                        </div>
                    )}

                </div>


            </div>
        </div>
    );
}


export default IndexMakerForm;