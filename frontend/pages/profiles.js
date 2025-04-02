import '/src/app/globals.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Champion() {
  const [championData, setChampionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupérer le champion avec l'ID 2
    axios.get(`http://localhost:3000/champion/champion-id/11`)
      .then(response => {
        setChampionData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
        setError('Une erreur est survenue. Veuillez réessayer plus tard.');
        setLoading(false);
      });
  }, []); // La dépendance vide [] permet de ne charger les données qu'une seule fois au chargement de la page

  if (loading) return <p className="text-center text-white">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!championData) return <p className="text-center text-red-500">Champion introuvable.</p>;

  const imageUrl = `http://localhost:3000/img/${championData.champion_image}`;




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
      <img src={imageUrl} alt={championData.champion_name} style={{ width: '200px', height: '200px' }} />
        <div>
          <h1 className="text-3xl font-bold">{championData.champion_name}</h1>
          <p>Rôle : {championData.role}</p>
          <p>{championData.lore}</p>
        </div>
      </div>
    </div>
  );
}
