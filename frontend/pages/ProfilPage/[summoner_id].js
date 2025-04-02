import Link from 'next/link';  // Ajout de l'importation de Link
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

const ProfilePage = ({ summoner_id }) => {
  const [summoner, setSummoner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummoner = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/summoners/summoner-id/${summoner_id}`);
        setSummoner(response.data);
        setLoading(false);
      } catch (err) {
        setError('Impossible de récupérer les informations de l\'invocateur.');
        setLoading(false);
      }
    };

    fetchSummoner();
  }, [summoner_id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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

      {/* Profile Header */}
      <header className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <Image 
          src={`/${summoner.profile_icon_id}`} 
          alt="Profile Icon" 
          width={64} 
          height={64} 
          className="rounded-full" 
        />
        <div>
          <h1 className="text-xl font-bold">{summoner.summoner_name}</h1>
          <p className="text-sm text-gray-400">Level: {summoner.summoner_level}</p>
          <p className="text-sm text-gray-400">Region: {summoner.region}</p>
        </div>
      </header>

      {/* Ranked Stats */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Ranked Stats</h2>
        <p>Rank: {summoner.ranked_division} - {summoner.lp} LP</p>
      </div>

      {/* Match History */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Match History</h2>
        <div className="mt-4 bg-gray-700 p-3 rounded-lg">
          <h3 className="font-semibold">Recent Match</h3>
          {/* Match history content */}
        </div>
      </div>
    </div>
  );
};

// Fonction pour obtenir les paramètres du `summoner_id` depuis l'URL
export async function getServerSideProps(context) {
  const { summoner_id } = context.params;
  return {
    props: { summoner_id },  // On passe le `summoner_id` en prop à la page
  };
}

export default ProfilePage;
