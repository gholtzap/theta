import Image from 'next/image';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Header from '../components/Header';
import jwt from 'jsonwebtoken';




export default function LoginPage() {

  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const UI_URL = process.env.NEXT_PUBLIC_UI_URL;
  
  const router = useRouter();

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true); // start loading

    const formData = new FormData(event.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (response.ok) {

      const userEmail = responseData.email;
      const userName = responseData.username;

      console.log("Server Response - Email:", userEmail);
      console.log("Server Response - Username:", userName);

      const token = jwt.sign({ username: userName, email: userEmail }, 'SECRET_KEY', { expiresIn: '1h' });

      localStorage.setItem('currentUser', JSON.stringify({ email: userEmail, username: userName }));

      router.push('/');
    }
    else {
      console.error(responseData.error);
    }

    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem('currentUser');

    router.push('/login');
  }



  return (
    <div>
      <Header />

      <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-zinc-950">

        <div className="z-10 w-full max-w-6xl items-center justify-between font-serif text-md lg:flex">
          <Image
            src="/logos/theta-text-logo.png"
            alt="Kingston Text Logo"
            className="dark:invert"
            width={175}
            height={44}
            priority
          />

          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href= {UI_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/logos/kingston-text-logo.png"
                alt="Kingston Text Logo"
                className="dark:invert"
                width={200}
                height={44}
                priority
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
          <Image
            className="relative filter invert mb-8"
            src="/login.webp"
            alt="Theta Logo"
            width={200}
            height={54}
            priority
          />

          <form className="w-full max-w-md" onSubmit={handleLogin}>
            <div className="flex flex-col mb-6">
              <label htmlFor="email" className="mb-2 text-sm font-bold">Email:</label>
              <input type="email" id="email" name="email" className="p-2 text-black border rounded-md" required />
            </div>

            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="mb-2 text-sm font-bold">Password:</label>
              <input type="password" id="password" name="password" className="p-2 text-black border rounded-md" required />
            </div>

            <div className="flex items-center justify-between">
              <button type="submit" className="px-4 py-2 font-bold text-white bg-white-500 rounded-md hover:bg-white-600" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <a href="/register" className="text-sm text-white-500 hover:underline">Register</a>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

