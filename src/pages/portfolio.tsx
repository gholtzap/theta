import { useUser } from '../contexts/userContext';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Holding = {
  ticker: string;
  shares: number;
  date: string;
};

type Portfolio = {
  username: string;
  holdings: Holding[];
  earnings?: {
    total_earnings: number;
    total_percent_return: number;
    weekly_earnings: number;
    weekly_return: number;
    monthly_earnings: number;
    monthly_return: number;
    yearly_earnings: number;
    yearly_return: number;
  };
};

const PortfolioPage: React.FC = () => {
  const { user } = useUser();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  
  useEffect(() => {
    if (user?.username) {
      fetch(`${API_URL}/portfolio/${user.username}`)
        .then((res) => res.json())
        .then((portfolioData) => {
          setPortfolio(portfolioData);

          return fetch(`${API_URL}/earnings/${user.username}`);
        })
        .then((res) => res.json())
        .then((earningsData) => {
          setPortfolio((prevPortfolio) => {
            if (!prevPortfolio) return null;
            return {
              ...prevPortfolio,
              earnings: earningsData,
            };
          });
          
        })
        .catch((err) => console.error(err));
    }
  }, [user]);


  return (
    <div className="p-4">
      <Header />
      <h1 className="text-xl mt-10 mb-4">Your Portfolio</h1>

      {portfolio?.earnings && (
        <div className="mb-8">
          <h2 className="text-lg mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(portfolio.earnings).map(([key, value], index) => (
              <div key={index} className="border p-4">
                <strong>{key.replace('_', ' ').toUpperCase()}:</strong> ${value.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      )}

      {portfolio?.holdings.map((holding, index) => (
        <div key={index} className="border p-4 my-2">
          <p><strong>Ticker:</strong> {holding.ticker}</p>
          <p><strong>Shares:</strong> {holding.shares}</p>
          <p><strong>Date:</strong> {holding.date}</p>
        </div>
      ))}
    </div>
  );
};

export default PortfolioPage;
