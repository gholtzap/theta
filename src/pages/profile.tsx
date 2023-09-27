import React from 'react';
import Profile from '../components/Profile/Profile';
import Header from '../components/Header';
import Earnings from '../components/Profile/Earnings'; 
import Portfolio from '../components/Profile/Portfolio';


const UserProfile = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-between w-1/2">
        <div>
          <Header />
          <h1>Welcome to the Dashboard</h1>
          <Profile />
        </div>
        <Earnings />
      </div>
      <div className="w-1/2">
        <Portfolio username="gholtzap" />
      </div>
    </div>
  );
}





export default UserProfile;
