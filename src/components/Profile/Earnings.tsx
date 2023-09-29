import React, { useState, useEffect } from 'react';

const Earnings = () => {

    const [sp500Change, setSp500Change] = useState(0);
    const [dowJonesChange, setDowJonesChange] = useState(0);
    const [sp500Price, setSp500Price] = useState<number | null>(null);
    const [dowJonesPrice, setDowJonesPrice] = useState<number | null>(null);


    useEffect(() => {
        // Fetch stock data from the backend
        fetch('/portfolio/market-data')  // Adjust the URL accordingly if your backend is hosted on a different domain or port
            .then(response => response.json())
            .then(data => {
                setSp500Price(data.sp500);
                setDowJonesPrice(data.dow_jones);
            })
            .catch(error => {
                console.error('Failed to fetch market data:', error);
            });
    }, []);

    // Static earnings data (add your logic for determining increase/decrease)
    const totalEarnings = {
        value: 1500.50,
        change: 2.5, // Percentage change (positive for increase, negative for decrease)
    };
    const dailyEarnings = {
        value: 50.20,
        change: -0.2,
    };
    const weeklyEarnings = {
        value: 350.50,
        change: 0.8,
    };
    const yearlyEarnings = {
        value: 18260,
        change: 3.4,
    };


    const renderEarnings = (
        label: string, 
        data: { value: number; change: number; },
        sp500Change: number,
        dowJonesChange: number
    ) => (
        <div className="flex items-center mb-4 w-full">
            <div className="flex-1 flex items-center">
                <strong className="text-zinc-950 dark:text-neutral-100 w-1/3">{label}:</strong>
                <span className="text-xl font-semibold text-zinc-950 dark:text-neutral-100">
                    ${data.value.toFixed(2)}
                    <span className={`ml-2 ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        
                        {data.change >= 0 ? '↑' : '↓'}
                        {Math.abs(data.change)}%
                    </span>
                </span>
            </div>
            <div className="flex-1 flex items-center">
                <strong className="text-zinc-950 dark:text-neutral-100 mr-2">SP500:</strong>
                <span className={`text-xl font-semibold ${sp500Change >= 0 ? 'text-green-500' : 'text-red-500'}`}>

                    {sp500Change >= 0 ? '↑' : '↓'}
                    {Math.abs(sp500Change)}%
                </span>
            </div>
            <div className="flex-1 flex items-center">
                <strong className="text-zinc-950 dark:text-neutral-100 mr-2">Dow Jones:</strong>
                <span className={`text-xl font-semibold ${dowJonesChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {dowJonesChange >= 0 ? '↑' : '↓'}
                    {Math.abs(dowJonesChange)}%
                </span>
            </div>
        </div>
    );

    return (
        <div className="bg-white mt-10 p-8 dark:bg-neutral-800 rounded-xl shadow-lg">
            {renderEarnings("Total", totalEarnings, sp500Change, dowJonesChange)}
            {renderEarnings("Daily", dailyEarnings, sp500Change, dowJonesChange)}
            {renderEarnings("Weekly", weeklyEarnings, sp500Change, dowJonesChange)}
            {renderEarnings("Yearly", yearlyEarnings, sp500Change, dowJonesChange)}
        </div>
    );
}

export default Earnings;