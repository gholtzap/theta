import Image from 'next/image'
import '../styles/globals.css'
import Header from '../components/Header'
import { UserProvider } from '../contexts/userContext';

export default function index() {
  return (
    <UserProvider>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-zinc-950">

        <div className="z-10 w-full max-w-6xl items-center justify-between font-serif text-md lg:flex">
          <p >

            <Image
              src="/logos/theta-text-logo.png"
              alt="Kingston Text Logo"
              className="dark:invert"
              width={175}
              height={44}
              priority
            />
          </p>


          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="http://localhost:3000/"
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

        <div className="flex justify-center items-start min-h-screen">
          <div className="flex items-center justify-center mt-36">

            <Image
              className="relative filter invert mr-16"
              src="/logos/theta-logo.png"
              alt="Theta Logo"
              width={120}
              height={67}
              priority
            />

            <Image
              className="relative filter invert mr-16"
              src="/logos/theta-text-logo.png"
              alt="Theta Logo"
              width={567}
              height={67}
              priority
            />



          </div>

        </div>



        <div className="transform -translate-y-60 mb-32 grid text-center place-items-stretch lg:mb-0 lg:grid-cols-4 lg:text-left">
          <a
            href='/alpha'
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 transition-transform transform hover:scale-105"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-3xl font-semibold`}>
              α{' '}
            </h2>
            <h2 className={`mb-3 text-1xl font-semibold`}>
              Timing{' '}
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Should you buy a stock or not? Find out here.
            </p>
          </a>

          <a
            href='/beta'
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 transition-transform transform hover:scale-105"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-3xl font-semibold`}>
              β{' '}
            </h2>
            <h2 className={`mb-3 text-1xl font-semibold`}>
              Index Maker{' '}
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Create your own indexes and see how they perform.
            </p>
          </a>

        </div>
      </main>
    </UserProvider>
  )
}
