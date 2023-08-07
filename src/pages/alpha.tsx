import { useState } from 'react';
import TimingForm from '../components/TimingForm';
import Header from '../components/Header';

export default function Alpha() {
  return (

    <div>
      <Header /> 
      <div>
        <TimingForm />
      </div>
    </div>
  );
}
