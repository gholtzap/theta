import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/userContext';
import { useRouter } from 'next/router'; 
import Header from '../components/Header';

function AdminPage() {
    const { user, setUser, isLoading } = useUser();
    const router = useRouter();
    const [targetUsername, setTargetUsername] = useState('');
    const [newRole, setNewRole] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 915)) {
            router.push('/');
        }
    }, [user, isLoading]);
    

    async function handleChangeRole() {
        const role = parseInt(newRole);
        if (isNaN(role)) {
            setMessage('Please enter a valid numeric role.');
            return;
        }

        const response = await fetch('http://localhost:5000/modify-role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_username: targetUsername,
                new_role: role
            })
        });

        const data = await response.json();

        if (response.ok) {
            setMessage(data.status);
        } else {
            setMessage(data.error);
        }
    }

    return user && user.role === 915 ? (
        <div>
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-950 font-serif">
            <div className="text-gray-200 mb-6">
                Logged in as <span className="font-bold">{user ? user.username : 'Loading...'}</span>
            </div>

            <div className="admin-panel bg-zinc-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4 text-zinc-400">Change User Role</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={targetUsername}
                        onChange={e => setTargetUsername(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none text-zinc-950 placeholder-zinc-600"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="New Role"
                        value={newRole}
                        onChange={e => setNewRole(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none text-zinc-950 placeholder-zinc-600"
                    />
                </div>

                <button 
                    onClick={handleChangeRole} 
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-600 transform hover:scale-105 transition-transform"
                >
                    Change Role
                </button>

                {message && (
                    <p className="mt-4 text-red-500">{message}</p>
                )}
            </div>
            
        </main>
        </div>
    ) : null;

}

export default AdminPage;
