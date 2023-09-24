import React, { useState } from 'react';
import Image from 'next/image';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import Header from '../components/Header';

export default function SignupPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const UI_URL = process.env.NEXT_PUBLIC_UI_URL;
    
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
    
        const formData = new FormData(event.currentTarget);
    
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
    
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
    
        const data = {
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: password,
            role:1
        };
    
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    
        if (response.ok) {
            router.push('/login');
        } else {
            const errorData = await response.json();
            console.error(errorData.error);
            setErrorMessage(errorData.error);
        }
    
        setLoading(false);
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
                            href={UI_URL}
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
                        src="/register.webp"
                        alt="Theta Logo"
                        width={240}
                        height={67}
                        priority
                    />

                    <form className="w-full max-w-md" onSubmit={handleSignup}>
                        {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}

                        <div className="flex flex-col mb-6">
                            <label htmlFor="username" className="mb-2 text-sm font-bold ">Username:</label>
                            <input type="text" id="username" name="username" className="p-2 text-black border rounded-md" required />
                        </div>

                        <div className="flex flex-col mb-6">
                            <label htmlFor="email" className="mb-2 text-sm font-bold">Email:</label>
                            <input type="email" id="email" name="email" className="p-2 text-black border rounded-md" required />
                        </div>

                        <div className="flex flex-col mb-6">
                            <label htmlFor="password" className="mb-2 text-sm font-bold">Password:</label>
                            <input type="password" id="password" name="password" className="p-2 text-black border rounded-md" required />
                        </div>

                        <div className="flex flex-col mb-6">
                            <label htmlFor="confirmPassword" className="mb-2 text-sm font-bold">Confirm Password:</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" className="p-2 text-black border rounded-md" required />
                        </div>

                        <div className="flex items-center justify-between">
                            <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600" disabled={loading}>
                                {loading ? 'Registering...' : 'Register'}
                            </button>

                            <a href="/login" className="text-sm text-black text-blue-500 hover:underline">Login</a>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
