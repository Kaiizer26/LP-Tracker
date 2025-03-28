import Image from "next/image";
import Link from 'next/link';
import '/src/app/globals.css';

export default function ProfilePage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white p-4" 
      style={{ 
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url('/img/teemo-background.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-transparent w-full z-50">
        <div className="text-2xl font-bold">LP-TRACKER</div>
        <div>
          <Link href="/register">
            <button className="bg-red-500 px-4 py-2 rounded-lg">S'inscrire</button>
          </Link>
          <Link href="/login">
            <button className="bg-blue-600 px-4 py-2 rounded-lg ml-2">Se connecter</button>
          </Link>
        </div>  
      </nav>

      {/* Search Bar */}
      <div className="flex justify-center mt-6">
        <div className="flex bg-gray-800 text-gray-400 p-3 rounded-lg w-full max-w-lg">
          <input
            type="text"
            placeholder="Search Champion or Player"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white outline-none"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-12"> {/* Ajout de padding-top pour éviter que le contenu soit caché derrière la navbar */}
        {/* Header */}
        <header className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-md">
          <Image src="/img/icon/10_Year_Anniversary_Poro_profileicon_old.png" alt="Profile" width={64} height={64} className="rounded-full" />
          <div>
            <h1 className="text-xl font-bold">depchai #VTN</h1>
            <p className="text-sm text-gray-400">Ladder Rank 1 (top 0.1%)</p>
          </div>
          <button className="ml-auto bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">Update</button>
        </header>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Ranked Solo</h2>
            <p>Challenger - 259 LP</p>
            <p>16W 2L (59% Win Rate)</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Ranked Flex</h2>
            <p>Gold 3 - 64 LP</p>
            <p>17W 15L (53% Win Rate)</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Match History</h2>
            <p>65% WR - 2.17 KDA</p>
            <p>Last 20 games: 5.4 / 6.3 / 8.4</p>
          </div>
        </div>
      </div>

      {/* Match History Table */}
      <div className="bg-gray-800 mt-6 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Match History</h2>
        <div className="mt-4 bg-gray-700 p-3 rounded-lg">
          <h3 className="font-semibold">Recent Match</h3>
          <div className="flex justify-between">
            <p className="text-blue-400">Victory (Red Team)</p>
            <p className="text-green-400">+31 LP</p>
          </div>
          <p>7 / 7 / 13 - 2.86 KDA</p>
          <p>Damage: 27,208</p>
          <div className="flex mt-2 space-x-2">
            <div className="bg-gray-600 p-2 rounded">🏆 Armaaj - 18 / 8 / 4</div>
            <div className="bg-gray-600 p-2 rounded">🔥 One Bump Man - 15 / 3 / 9</div>
            <div className="bg-gray-600 p-2 rounded">🎯 depchai - 7 / 7 / 13</div>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-700 p-3 rounded-lg">
          <h3 className="font-semibold">Defeat (Blue Team)</h3>
          <div className="flex justify-between">
            <p className="text-red-400">Defeat</p>
          </div>
          <p>4 / 13 / 11 - 1.15 KDA</p>
          <p>Damage: 17,220</p>
          <div className="flex mt-2 space-x-2">
            <div className="bg-gray-600 p-2 rounded">❌ Bella - 4 / 13 / 11</div>
            <div className="bg-gray-600 p-2 rounded">❌ Fat Zed001 - 3 / 12 / 19</div>
            <div className="bg-gray-600 p-2 rounded">❌ PACO PALOMAR - 15 / 7 / 7</div>
          </div>
        </div>
      </div>
    </div>
  );
}