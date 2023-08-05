import { useState } from 'react';
import TickerForm from '../components/TickerForm';

export default function Alpha() {
  const [result, setResult] = useState(null);

  const handleButtonClick = async () => {
    const res = await fetch('/api/stock', { method: 'POST' });
    const data = await res.json();
    setResult(data.result);
  };

  return (

    <div>
      <div>
        <TickerForm />
      </div>
    </div>
  );
}
