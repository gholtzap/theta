import { useState, FormEvent } from 'react';

type ApiResponse = {
    ticker: string;
    decision: string;
    change_needed: number;
    current_price: number;
    average: number;
}[];

async function postData(tickers: string[]): Promise<ApiResponse> {
    const response = await fetch('http://localhost:5000/tickers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tickers })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

const TickerForm: React.FC = () => {
    const [tickers, setTickers] = useState<string[]>([]);
    const [tickerInput, setTickerInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<ApiResponse | null>(null);

    const handleTickerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTickerInput(event.target.value);
    };

    const handleAddTicker = (event: FormEvent) => {
        event.preventDefault();
        setTickers(prevTickers => [...prevTickers, tickerInput]);
        setTickerInput('');
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        console.log("Submitting form"); // Add this line

        setLoading(true);
        setResults(null);

        try {
            console.log("Making request to server"); // Add this line

            const response = await fetch("http://localhost:5000/tickers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tickers: tickers }),
            });


            console.log("Received response from server"); // Add this line

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();

            console.log("Parsed response data"); // Add this line

            setResults(data.result); // Ensure that `data.result` is the array
        } catch (error) {
            console.log("Error occurred", error); // Add this line

        }

        setLoading(false);
    }



    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="ticker-input">Enter a ticker:</label>
            <input id="ticker-input" value={tickerInput} onChange={handleTickerInputChange} />
            <button onClick={handleAddTicker}>Add Ticker</button>
            <button type="submit" disabled={loading}>Submit</button>

            {results && results.map((result, index) => (
                <div key={index}>
                    <h2>{result.ticker}</h2>
                    <p>Decision: {result.decision}</p>
                    <p>Change Needed: {result.change_needed}</p>
                    <p>Current Price: {result.current_price}</p>
                    <p>Average: {result.average}</p>
                </div>
            ))}

        </form>
    );
};

export default TickerForm;
