import Link from 'next/link';
import '/src/app/globals.css';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Head>
        <title>LP.Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-transparent fixed w-full top-0 z-50">
        <Link href="/">
        <div className="text-2xl font-bold">LP-TRACKER</div>
        </Link>
        <div>
          <Link href="/register">
          <button className="bg-red-500 px-4 py-2 rounded-lg">S'inscrire</button>
          </Link>
          <Link href="/login">
          <button className="bg-blue-600 px-4 py-2 rounded-lg ml-2">Se connecter</button>
          </Link>
        </div>  
      </nav>

      {/* Hero Section */}
      <section
        className="relative flex justify-center items-center h-screen bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url('/img/aurora-background.jpg')" }}
      >
        <div className="relative p-10 rounded-lg text-center w-1/2">
          <h1 className="text-4xl font-bold text-white">LP Tracker</h1>
          <p className="mt-4 text-white">Trackez la personne que vous voulez !</p>
          <form className="w-full max-w-lg mx-auto mt-6">
            <div className="flex bg-white text-gray-900 p-3 rounded-lg">
              <input type="text" placeholder="Chercher un joueur" className="w-full px-4 py-2 outline-none" />
              <button type="submit" className="bg-yellow-500 px-6 py-2 rounded-lg">🔍</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
