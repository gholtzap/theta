import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import Image from 'next/image';
import { useUser } from '../../contexts/userContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const { user } = useUser();
  const [portfolioValue, setPortfolioValue] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${API_URL}/user/${user.username}`);
        console.log("Fetched user data:", response.data);
        console.log("Fetched profile picture:", response.data.pfp);

        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);

        setProfilePicturePreview(response.data.pfp || '');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    const fetchPortfolioValue = async () => {
      if (!user) return;
      try {
          const response = await axios.get(`${API_URL}/portfolio_value/${user.username}`);
          if (response.data && response.data.portfolio_value) {
              setPortfolioValue(response.data.portfolio_value);
          }
      } catch (error) {
          console.error('Failed to fetch portfolio value:', error);
      }
  };

    fetchUserData();
    fetchPortfolioValue();
  }, [user]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        if (e.target) {
          const originalBase64 = (e.target as FileReader).result?.toString();
          const image = new window.Image();
  
          image.onload = async () => {
            const desiredWidth = 192; // Or your desired width
            const desiredHeight = 192; // Or your desired height
  
            const canvas = document.createElement('canvas');
            canvas.width = desiredWidth;
            canvas.height = desiredHeight;
            const ctx = canvas.getContext('2d');
            
            // Drawing image to canvas with desired dimensions
            ctx!.drawImage(image, 0, 0, desiredWidth, desiredHeight);
            
            const base64Cropped = canvas.toDataURL();
  
            setProfilePicturePreview(base64Cropped);
  
            // Send the image to the backend
            const response = await fetch(`${API_URL}/update_pfp`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: user?.username,
                image: base64Cropped.split(',')[1]
              })
            });
  
            const data = await response.json();
            console.log("API response after updating profile picture:", data);
          };
  
          if (originalBase64) {
            image.src = originalBase64;
        }
        }
      };
      reader.readAsDataURL(file);
    }
  };
  



  return (
    <div className="flex bg-zinc-950">
      <div className="bg-white mt-40 flex w-full max-w-2xl h-64 rounded-xl shadow-lg p-8 dark:bg-neutral-800 items-center">
        <div className="w-1/4 flex justify-center items-center h-48 w-48">
          <input type="file" accept="image/*" hidden id="profile-upload" onChange={handleImageUpload} />
          <label htmlFor="profile-upload" className="cursor-pointer">
            <img
              src={profilePicturePreview || "/login.svg"}
              alt="Profile"
              className="rounded-md border-2 border-zinc-950 dark:border-neutral-700"
              width={192}
              height={192}
            />
          </label>
        </div>

        <div className="w-3/4 flex flex-col justify-around h-full pl-8">
          <div>
            <h5 className="text-xl font-semibold text-zinc-950 dark:text-neutral-100">{user?.username}</h5>
            <p className="text-base text-gray-500 dark:text-neutral-400">{user?.email}</p>
          </div>
          <div className="bg-gray-200 p-2 rounded-md flex justify-between items-center hover:border-zinc-950 hover:border dark:bg-neutral-700">
            <div className="flex items-center">
              <div className="bg-zinc-950 p-3 rounded-md">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center dark:bg-neutral-800">
                  <Image
                    src="google_icons/money.svg"
                    alt="Money Icon"
                    width={32}
                    height={32}
                    className="text-zinc-950 dark:text-neutral-100 font-semibold text-lg"
                  />
                </div>
              </div>
              <div className="ml-4 flex flex-col items-start">
                <span className="text-base font-semibold text-zinc-950 dark:text-neutral-100">Portfolio Value</span>
                <span className="text-xl font-semibold text-zinc-950 dark:text-neutral-100"><span className="text-zinc-950 dark:text-neutral-100">$</span>{portfolioValue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;