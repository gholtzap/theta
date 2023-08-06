import { useState } from 'react';
import '../styles/globals.css'


const TickerForm = () => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [tickerInput, setTickerInput] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const addTicker = () => {
    if (!tickers.includes(tickerInput)) {
      setTickers([...tickers, tickerInput]);
    }
    setTickerInput('');
  }

  const removeTicker = (index: number) => {
    setTickers(tickers.filter((_, i) => i !== index));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const response = await fetch('http://localhost:5000/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickers: tickers }),
    });

    const data = await response.json();
    data.result.forEach(item => item.change_needed = Math.round(item.change_needed)); 
    setResults(data.result);

    setLoading(false);
  }

  const handleTickerAddition = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tickerInput !== "") {
      addTicker();
      setTickerInput(""); 
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      <h1 className="mb-0 text-5xl font-bold">α</h1>
      <h1 className="mb-8 text-2xl font-bold">Timing</h1>

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
        <button type="button" onClick={handleSubmit} disabled={loading} className="absolute right-0 top-0 bg-white-500 text-white border-none px-6 py-3 scale-150">
          <img src="double_arrow.svg" alt="Submit" className="w-4 h-4" />
        </button>
      </div>







      {/* Ticker list */}
      <div className="w-3/4 grid grid-cols-6 gap-2 mb-8">
        {tickers.map((ticker, index) => (
          <div key={index} className="w-40 h-10 p-6 m-4 text-white rounded-xl border border-zinc-500 flex justify-between items-center">
            <h2 className="text-xl font-semibold">{ticker}</h2>
            <button onClick={() => removeTicker(index)} className="btn">X</button>
          </div>
        ))}
      </div>



      {/* Display results */}
      <div className="w-3/4 grid grid-cols-6 gap-4">
        {Array.isArray(results) && results.map((result, index) => (
          <div key={index} className="w-40 h-20 p-6 m-0 text-black rounded-xl border-4 border-zinc-200 flex justify-between items-center"
            style={{ backgroundColor: result.change_needed >= 0 ? '#d1e7dd' : '#f8d7da' }}>
            <h2 className="text-xl font-semibold">{result.ticker.toUpperCase()}</h2>
            <p className="mt-2 text-md">{result.change_needed}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TickerForm;