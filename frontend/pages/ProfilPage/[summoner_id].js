import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import "/src/app/globals.css";

const ProfilePage = ({ summoner, rankedStats, stats, matchHistory, error }) => {
  if (error) {
    return <div className="text-red-500 p-4">Erreur : {error}</div>;
  }

  return (
    <div
      className="bg-gray-900 min-h-screen text-white p-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url('/img/teemo-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-bold">
          LP-TRACKER
        </Link>
        <div>
          <Link href="/register">
            <button className="bg-red-500 px-4 py-2 rounded-lg">
              S'inscrire
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-blue-600 px-4 py-2 rounded-lg ml-2">
              Se connecter
            </button>
          </Link>
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
            <h1 className="text-xl font-bold">
              {summoner.summoner_name} #{summoner.puuid}
            </h1>
            <p className="text-sm text-gray-400">
              Niveau {summoner.summoner_level}
            </p>
          </div>
          <button className="ml-auto bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
            Update
          </button>
        </header>

        {/* Statistiques Ranked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Ranked Solo</h2>
            <p>
              {stats.solo_rank} - {rankedStats.lp} LP
            </p>
            <p>
              {stats.solo_wins}W {stats.solo_losses}L ({rankedStats.winrate}%
              Win Rate)
            </p>
          </div>

          {/* Stats globales */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Résumé</h2>
            <p>
              {rankedStats.winrate} Pas encore % WR - {rankedStats.kda} KDA
            </p>
            <p>
              Derniers 20 matchs: Pas de fonction pr ça{rankedStats.avgKills} /{" "}
              {rankedStats.avgDeaths} / {rankedStats.avgAssists}
            </p>
          </div>
        </div>

        {/* Historique de matchs */}
        <div className="bg-gray-800 mt-6 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Match History</h2>
          {Array.isArray(matchHistory) && matchHistory.length > 0 ? (
            matchHistory.map((match, index) => (
              <div key={index} className="mt-4 bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between">
                  <p
                    className={
                      match.result === "Victory"
                        ? "text-blue-400"
                        : "text-red-400"
                    }
                  >
                    {match.result}
                  </p>
                  <p className="text-gray-400">{match.role}</p>
                </div>
                <p>
                  {match.kills} / {match.deaths} / {match.assists} KDA
                </p>
                <p>Damage: {match.gold_earned?.toLocaleString() || 0}</p>
                <p>Gold: {match.gold_earned?.toLocaleString() || 0}</p>
                <p>Match: {match.match_name}</p>
                <div className="flex mt-2 space-x-2 overflow-x-auto">
                  <div className="bg-gray-600 p-2 rounded">
                    Team: {match.team_name} ({match.team_side})
                  </div>
                </div>
                {/* Détails du match */}
                <div className="mt-4">
                  <h3 className="text-md font-semibold">Match Details:</h3>
                  <p>Game Type: {match.matchDetails.game_type}</p>
                  <p>
                    Duration:{" "}
                    {Math.floor(match.matchDetails.game_duration / 60)}m{" "}
                    {match.matchDetails.game_duration % 60}s
                  </p>
                  <p>Winning Team: {match.matchDetails.winning_team_side}</p>
                </div>
                {/* Liste des participants */}
                <div className="mt-4">
                  <h3 className="text-md font-semibold">Participants:</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {match.participants.map((participant, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-600 p-2 rounded flex justify-between"
                      >
                        <span>{participant.summoner_name}</span>
                        <span>
                          {participant.kills} / {participant.deaths} /{" "}
                          {participant.assists} KDA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              Aucun historique de matchs disponible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { summoner_id } = context.params;

  try {
    // Récupérer les informations du summoner
    const summonerRes = await axios.get(
      `http://localhost:3000/summoners/summoner-id/${summoner_id}`
    );
    const summoner = summonerRes.data;

    // Récupérer les statistiques classées
    const rankedRes = await axios.get(
      `http://localhost:3000/summoners/summoner-id/${summoner_id}/ranked`
    );
    const rankedStats = rankedRes.data;

    // Récupérer les statistiques globales
    const statsRes = await axios.get(
      `http://localhost:3000/stats/summoner-id/${summoner_id}`
    );
    const stats = statsRes.data;

    // Récupérer l'historique des matchs
    const matchHistoryRes = await axios.get(
      `http://localhost:3000/matchparticipant/summoner-id/${summoner_id}`
    );
    const matchHistory = matchHistoryRes.data;

    // Récupérer les participants et les détails du match pour chaque match
    const matchHistoryWithDetails = await Promise.all(
      matchHistory.map(async (match) => {
        // Récupérer les participants du match
        const participantsRes = await axios.get(
          `http://localhost:3000/matchparticipant/match/${match.match_id}/`
        );

        // Récupérer les détails du match via participant_id
        const matchDetailsRes = await axios.get(
          `http://localhost:3000/matchparticipant/match/participant_id/${match.participant_id}`
        );

        return {
          ...match,
          participants: participantsRes.data, // Ajoute les participants au match
          matchDetails: matchDetailsRes.data, // Ajoute les détails du match
        };
      })
    );

    // Retourner les données comme props
    return {
      props: {
        summoner,
        rankedStats,
        stats,
        matchHistory: matchHistoryWithDetails,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);

    // En cas d'erreur, retourner une page avec un message d'erreur
    return {
      props: {
        error: "Impossible de récupérer les données.",
      },
    };
  }
}

export default ProfilePage;
