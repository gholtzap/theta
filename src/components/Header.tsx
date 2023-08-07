import Link from 'next/link';
import '../styles/globals.css'
import { useRouter } from 'next/router';

const hoverColor = "text-cyan-400"

const Header = () => {
    const router = useRouter();

    return (
        <header className="w-full bg-zinc-950 text-white fixed top-0 z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center p-5">
                {/* Logo and home link */}
                <Link href="/">
                    <div className="text-2xl font-bold cursor-pointer">
                        <img src="/logos/theta-logo.png" className="invert" height={100} width={100}></img>
                    </div>
                </Link>

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
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;