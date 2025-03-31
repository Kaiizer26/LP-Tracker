'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '/src/app/globals.css';


export default function ProfilePage() {
  const [summoner, setSummoner] = useState(null);
  const [rankedStats, setRankedStats] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]); // Simulé ici

  const summonerName = 'depchai';

  useEffect(() => {
    async function fetchData() {
      try {
        const summonerRes = await fetch(`http://localhost:3001/summoners/summoner-name/${summonerName}`);
        const summonerData = await summonerRes.json();
        setSummoner(summonerData);

        const summonerId = summonerData.summoner_id;

        const rankedRes = await fetch(`http://localhost:3001/summoners/summoner-id/${summonerId}/ranked`);
        const rankedData = await rankedRes.json();
        setRankedStats(rankedData);

        // Simulé ici, remplace par ton propre endpoint match history si existant
        const fakeHistory = [
          {
            result: 'Victory',
            kda: '7 / 7 / 13',
            kdaRatio: 2.86,
            lpChange: '+31 LP',
            damage: 27208,
            team: [
              { name: 'Armaaj', kda: '18 / 8 / 4' },
              { name: 'One Bump Man', kda: '15 / 3 / 9' },
              { name: 'depchai', kda: '7 / 7 / 13' }
            ]
          },
          {
            result: 'Defeat',
            kda: '4 / 13 / 11',
            kdaRatio: 1.15,
            damage: 17220,
            team: [
              { name: 'Bella', kda: '4 / 13 / 11' },
              { name: 'Fat Zed001', kda: '3 / 12 / 19' },
              { name: 'PACO PALOMAR', kda: '15 / 7 / 7' }
            ]
          }
        ];
        setMatchHistory(fakeHistory);
      } catch (err) {
        console.error('Erreur lors du fetch des données:', err);
      }
    }

    fetchData();
  }, []);

  if (!summoner || !rankedStats) { // Désactive la vérification de flexStats
    return <div className="text-white p-4">Chargement...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url('/img/teemo-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold">LP-TRACKER</div>
        <div>
          <Link href="/register"><button className="bg-red-500 px-4 py-2 rounded-lg">S'inscrire</button></Link>
          <Link href="/login"><button className="bg-blue-600 px-4 py-2 rounded-lg ml-2">Se connecter</button></Link>
        </div>
      </nav>

      {/* Profil */}
      <div className="pt-12">
        <header className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-md">
          <Image
            src="/img/icon/10_Year_Anniversary_Poro_profileicon_old.png" // URL statique pour l'image de profil
            alt="Icone de profil"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">{summoner.summoner_name} #{summoner.region}</h1>
            <p className="text-sm text-gray-400">Niveau {summoner.summoner_level}</p>
          </div>
          <button className="ml-auto bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">Update</button>
        </header>

        {/* Statistiques Ranked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Ranked Solo</h2>
            <p>{rankedStats.rank} - {rankedStats.lp} LP</p>
            <p>{rankedStats.wins}W {rankedStats.losses}L ({rankedStats.winrate}% Win Rate)</p>
          </div>

          {/* Section flex temporairement supprimée */}
          {/* <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Ranked Flex</h2>
            <p>{flexStats.rank} - {flexStats.lp} LP</p>
            <p>{flexStats.wins}W {flexStats.losses}L ({flexStats.winrate}% Win Rate)</p>
          </div> */}

          {/* Stats globales */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Résumé</h2>
            <p>{rankedStats.winrate}% WR - {rankedStats.kda} KDA</p>
            <p>Derniers 20 matchs: {rankedStats.avgKills} / {rankedStats.avgDeaths} / {rankedStats.avgAssists}</p>
          </div>
        </div>

        {/* Historique de matchs */}
        <div className="bg-gray-800 mt-6 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Match History</h2>
          {matchHistory.map((match, index) => (
            <div key={index} className="mt-4 bg-gray-700 p-3 rounded-lg">
              <h3 className="font-semibold">{match.result}</h3>
              <div className="flex justify-between">
                <p className={match.result === 'Victory' ? 'text-blue-400' : 'text-red-400'}>
                  {match.result}
                </p>
                {match.lpChange && <p className="text-green-400">{match.lpChange}</p>}
              </div>
              <p>{match.kda} - {match.kdaRatio} KDA</p>
              <p>Damage: {match.damage.toLocaleString()}</p>
              <div className="flex mt-2 space-x-2 overflow-x-auto">
                {match.team.map((player, idx) => (
                  <div key={idx} className="bg-gray-600 p-2 rounded">{player.name} - {player.kda}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
