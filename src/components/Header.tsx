import Link from 'next/link';
import '../styles/globals.css'
import { useRouter } from 'next/router';
import { useUser } from '../contexts/userContext';

const hoverColor = "text-cyan-400"

const Header = () => {
    const { user, setUser } = useUser();  // Destructure both user and setUser
    const router = useRouter();

    const handleLogout = () => {
        // Clear user data from context
        setUser(null);

        // Remove user data from localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('email');

        // Redirect user to login or a public page
        router.push('/login');
    }

    return (
        <header className="w-full bg-zinc-950 text-white fixed top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center p-5">

            {/* Logo and User Status */}
            <div className="flex items-center space-x-4">
                <Link href="/">
                    <div className="text-2xl font-bold cursor-pointer">
                        <img src="/logos/theta-logo.png" className="invert" height={40} width={40}></img>
                    </div>
                </Link>
                {user ? (
                    <>
                        <div className="bg-zinc-800 p-4 rounded-md shadow-md">
                            <p className="text-white-900">Logged in as <span className="font-bold">{user.username}</span></p>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center space-x-4">

                        <p className="text-gray-600">
                            Not logged in. ‎
                            <Link href="/login" className="text-blue-600 hover:underline cursor-pointer">
                                log in
                            </Link>
                            {" "}or{" "}
                            <Link href="/register" className="text-blue-600 hover:underline cursor-pointer">
                                register
                            </Link>
                        </p>


                    </div>
                )}
                </div>

                {/* Logo and home link */}


                {/* Navigation links */}
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/alpha">
                                <div className={`text-xl font-semibold ${router.pathname === "/alpha" ? "text-cyan-600" : ""} cursor-pointer`}>α</div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/beta">
                                <div className={`text-xl font-semibold ${router.pathname === "/beta" ? "text-cyan-600" : ""} cursor-pointer`}>β</div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/login">
                                <div className={`text-xl font-semibold ${router.pathname === "/login" ? "text-cyan-600" : ""} cursor-pointer relative group`}>
                                    <img src='login.svg' className="filter invert"></img>
                                    <span className="tooltiptext text-sm w-16 absolute opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1/2 bottom-full left-1/2 transform px-3 py-1 bg-gray-700 text-white rounded shadow-lg">
                                        Log In
                                    </span>
                                </div>
                            </Link>
                        </li>


                        <li>
                            <div
                                className={`text-xl font-semibold ${router.pathname === "/logout" ? "text-cyan-600" : ""} cursor-pointer relative group`}
                                onClick={handleLogout}
                            >
                                <img src='logout.svg' className="filter invert"></img>
                                <span className="tooltiptext text-sm w-20 absolute opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1/2 bottom-full left-1/2 transform px-3 py-1 bg-gray-700 text-white rounded shadow-lg">
                                    Log Out
                                </span>
                            </div>
                        </li>
                        <li>
                            <Link href="/register">
                                <div className={`text-xl font-semibold ${router.pathname === "/register" ? "text-cyan-600" : ""} cursor-pointer relative group`}>
                                    <img src='register.svg' className="filter invert"></img>
                                    <span className="tooltiptext text-sm w-18 absolute opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1/2 bottom-full left-1/2 transform px-3 py-1 bg-gray-700 text-white rounded shadow-lg">
                                        Register
                                    </span>
                                </div>
                            </Link>
                        </li>
                    </ul>

                </nav>


            </div>
        </header>
    );
}

export default Header;