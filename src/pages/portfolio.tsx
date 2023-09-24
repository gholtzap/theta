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

  const renderEarningsForPeriod = (period: string) => {
    let earningsValue: number | undefined;
    let returnValue: number | undefined;

    if (period === "total") {
      earningsValue = portfolio?.earnings?.total_earnings;
    } else {
      const earningsKey = `${period}_earnings`;
      const returnKey = `${period}_return`;
      earningsValue = portfolio?.earnings?.[earningsKey as keyof typeof portfolio.earnings];
      returnValue = portfolio?.earnings?.[returnKey as keyof typeof portfolio.earnings];

    }

    if (earningsValue === undefined || (period !== "total" && returnValue === undefined)) {
      return null;
    }

    return (
      <div key={period} className="border p-4 rounded shadow">
        <strong>{period.toUpperCase()} EARNINGS:</strong>
        <div>
          <span style={{ color: earningsValue >= 0 ? 'green' : 'red' }}>
            ${earningsValue.toFixed(2)}
          </span>
          {returnValue !== undefined && (
            <span className="ml-4" style={{ color: returnValue >= 0 ? 'green' : 'red' }}>
              %{returnValue.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderTotalEarnings = () => {
    const earningsValue = portfolio?.earnings?.total_earnings;

    if (earningsValue === undefined) {
      return null;
    }

    return (
      <div className="border p-4 rounded shadow mb-8">
        <strong>Total Money Earned:</strong>
        <div>
          <span style={{ color: earningsValue >= 0 ? 'green' : 'red' }}>
            ${earningsValue.toFixed(2)}
          </span>
        </div>
      </div>
    );
  };
  

  return (
    <div className="p-4">
      <Header />
      <h1 className="text-xl mt-10 mb-4">Your Portfolio</h1>
      
      {portfolio?.earnings && (
        <div className="mb-8">
          <h2 className="text-lg mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            {["total","weekly", "monthly", "yearly"].map((period) =>
              renderEarningsForPeriod(period)
            )}
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