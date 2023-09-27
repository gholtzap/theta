import { useState } from 'react';
import '../styles/globals.css'

const TickerForm = () => {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [tickers, setTickers] = useState<string[]>([]);
  const [tickerInput, setTickerInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);

    const response = await fetch(`${API_URL}/alpha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickers: tickers }),
    });

    const data = await response.json();
    data.result.forEach((item: { change_needed: number; }) => item.change_needed = Math.round(item.change_needed));
    setResults(data.result);

    setLoading(false);
  }


  const handleTickerAddition = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tickerInput !== "") {
      addTicker();
      setTickerInput("");
    }
  }

  const maxChange = Math.max(...results.map(result => Math.abs(result.change_needed)));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      <h1 className="mb-0 text-5xl font-bold">α</h1>
      <h1 className="mb-8 text-2xl font-bold">Timing</h1>

      {/* Ticker input */}
      <div className="w-full max-w-md relative z-10 rounded-lg mb-8 overflow-hidden border border-zinc-900/30">
        <input
          type="text"
          value={tickerInput}
          onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
          onKeyPress={handleTickerAddition}
          placeholder="Add a ticker"
          className="w-full px-4 py-2 focus:outline-none text-black"
        />
        <button type="button" onClick={handleSubmit} disabled={loading} className="absolute right-0 top-0 bg-white-500 text-white border-none px-6 py-3 scale-150">
  {loading ? (
    <div className="w-4 h-4 border-t-2 border-black rounded-full animate-spin"></div>
  ) : (
    <img src="google_icons/double_arrow.svg" alt="Submit" className="w-4 h-4" />
  )}
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
      <div className="w-3/4 grid grid-cols-6 gap-6">
        {Array.isArray(results) && results.map((result, index) => {
          const barWidth = Math.abs((result.change_needed / maxChange) * 100);

          return (
            <div
              key={index}
              className={`w-40 h-32 p-4 m-0 text-black rounded-xl border-4 transition-transform transform duration-150 hover:scale-105 
                    ${result.change_needed >= 0 ? 'bg-green-100 border-green-300 hover:bg-green-200' : 'bg-red-100 border-red-300 hover:bg-red-200'}`}
            >
              <div className="flex justify-between items-center h-5/6">
                <div>
                  <h2 className="text-xl font-bold mb-1">{result.ticker.toUpperCase()}</h2>
                  <p className="text-sm text-gray-500">{result.company_name}</p> {/* Displaying the company name */}
                </div>
                <div className="flex flex-col items-end">
                  <p className={`text-md font-semibold ${result.change_needed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.change_needed}
                  </p>
                  <p className={`text-sm font-medium ${result.change_needed >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {result.percentage_change}%
                  </p>
                </div>
              </div>
              {/* Illustrative Bar */}
              <div className="w-full h-2 mt-4 bg-gray-200 rounded">
                <div className={`h-full rounded ${result.change_needed >= 0 ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${barWidth}%` }}></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default TickerForm;