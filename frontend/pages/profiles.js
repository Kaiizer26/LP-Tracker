import '/src/app/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const { username } = router.query; // Récupère le nom d'invocateur depuis l'URL
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    
    // Remplace cette URL par ton API backend qui récupère les infos du joueur
    axios.get(`http://localhost:3000/api/models/user${username}`)
      .then(response => {
        setPlayerData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p className="text-center text-white">Chargement...</p>;
  if (!playerData) return <p className="text-center text-red-500">Joueur introuvable.</p>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10" 
      style={{ 
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url('/img/aurora-background.jpg')", 
      }} 
    >
      <Link href="/">
        <button className="bg-blue-600 px-4 py-2 rounded-lg mb-4">⬅ Retour</button>
      </Link>

      <div className="flex items-center space-x-4">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${playerData.profile_icon_id}.png`}
          alt="Icône de profil"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{playerData.summoner_name}</h1>
          <p>Niveau {playerData.summoner_level}</p>
          <p>Rang : {playerData.ranked_division} - {playerData.lp} LP</p>
        </div>
      </div>

      <h2 className="mt-6 text-2xl">Statistiques</h2>
      <p>KDA moyen : {playerData.kda}</p>
      <p>Ratio de victoires : {playerData.win_rate}%</p>

      <h2 className="mt-6 text-2xl">Parties récentes</h2>
      <div className="mt-4">
        {playerData.matches.map(match => (
          <div key={match.match_id} className={`p-4 mb-2 rounded-lg ${match.match_result === 'Win' ? 'bg-green-700' : 'bg-red-700'}`}>
            <p><strong>{match.champion_name}</strong> - {match.match_result}</p>
            <p>{match.kills} / {match.deaths} / {match.assists} (KDA)</p>
            <p>Durée : {Math.floor(match.match_duration / 60)} min {match.match_duration % 60} sec</p>
          </div>
        ))}
      </div>
    </div>
  );
}
