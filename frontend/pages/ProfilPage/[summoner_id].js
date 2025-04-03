import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import "/src/app/globals.css";
import championMapping from "/data/championMapping.json";

// Fonction pour normaliser le nom du champion
const formatChampionName = (name) => {
  if (!name) return "default"; // Retourne une image par défaut si le nom est absent
  return name.toLowerCase().replace(/[^a-z0-9]/g, ""); // Supprime les caractères spéciaux
};

// Fonction pour supprimer les espaces dans une chaîne
function removeSpaces(str) {
  return str.replace(/\s+/g, ""); // Remplace tous les espaces par une chaîne vide
}

const ProfilePage = ({ summoner, stats, matchHistory, error }) => {
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
        <header className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-md relative">
          <div className="relative">
            <Image
              src={`/img/icon/${summoner.summoner_icon_id}.png`} // URL statique pour l'image de profil
              alt="Icone de profil"
              width={64}
              height={64}
              className="rounded-full border-2 border-gray-600"
            />
            <span className="absolute -top-2 -left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              {summoner.summoner_level}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {summoner.summoner_name}{" "}
              <span className="text-gray-400">#{summoner.puuid}</span>
            </h1>
            <p className="text-sm text-gray-400">
              Niveau {summoner.summoner_level}
            </p>
          </div>
        </header>

        {/* Conteneur principal pour les statistiques et l'historique */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Colonne gauche : Statistiques */}
          <div className="col-span-1 md:col-span-1">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
              <Image
                src={`/img/rank/${stats.solo_ranked_division
                  .split(" ")[0]
                  .toLowerCase()}.png`}
                alt={`${stats.solo_ranked_division} Icon`}
                width={48}
                height={48}
                className="rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">Ranked Solo</h2>
                <p>
                  {stats.solo_ranked_division} - {stats.solo_lp} LP
                </p>
                <p>
                  {stats.solo_wins}W {stats.solo_losses}L ({stats.winrate}% Win
                  Rate)
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-4 flex items-center space-x-4">
              <Image
                src={`/img/rank/${stats.flex_ranked_division
                  .split(" ")[0]
                  .toLowerCase()}.png`}
                alt="Ranked Flex Division"
                width={48}
                height={48}
                className="rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">Ranked Flex</h2>
                <p>
                  {stats.flex_ranked_division} - {stats.flex_lp} LP
                </p>
                <p>
                  {stats.flex_wins}W {stats.flex_losses}L ({stats.flex_winrate}%
                  Win Rate)
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-4">
              <h2 className="text-lg font-semibold">Champion Stats</h2>
              {Array.isArray(stats.champion_masteries) && stats.champion_masteries.length > 0 ? (
                stats.champion_masteries.map((champion, index) => (
                  <div key={index} className="flex items-center justify-between mt-4 bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`/img/champion/${championMapping[champion.champion_id] || "default"}.png`}
                        alt={`${championMapping[champion.champion_id] || "Default"} Icon`}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                      <div>
                        <h3 className="text-md font-semibold">{champion.champion_name}</h3>
                        <p className="text-gray-400">{champion.number_of_games} games</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400">{champion.kda} KDA</p>
                      <p className="text-gray-400">{champion.winrate}% Win Rate</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Aucune statistique de champion disponible.</p>
              )}
            </div>
          </div>

          {/* Colonne droite : Historique des matchs */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
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
                        {match.winning_team_side}
                      </p>
                      <p className="text-gray-400">{match.role}</p>
                    </div>
                    <p>
                      {match.kills} / {match.deaths} / {match.assists}
                    </p>
                    <p className="text-gray-400">
                    {match.kda} KDA</p>
                    <p>{match.cs?.toLocaleString() || 0} CS</p>
                    <p>{match.gold_earned?.toLocaleString() || 0} Gold</p>
                    <p>Lp: {match.profit?.toLocaleString() || 0}</p>
                    <p>Match: {match.match_name}</p>
                    <div className="flex mt-2 space-x-2 overflow-x-auto">
                      <div className="bg-gray-600 p-2 rounded">
                        Team: ({match.team_side})
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
                      <p>
                        Winning Team: {match.matchDetails.winning_team_side}
                      </p>
                    </div>
                    {/* Informations du champion */}
                    <div className="mt-4">
                      <Image
                        src={`/img/champion/${removeSpaces(
                          match.champion.champion_name.toLowerCase()
                        )}.png`} // Supprime les espaces dans le nom du champion
                        alt={`${match.champion.champion_name} Icon`}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                      <p className="text-md font-semibold">
                        {match.champion.champion_name}
                      </p>
                    </div>
                    {/* Liste des participants */}
                    <div className="mt-4">
                      <h3 className="text-md font-semibold">Participants:</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {match.participants.map((participant, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-600 p-2 rounded flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              {/* Image du champion */}
                              <Image
                                src={`/img/champion/${removeSpaces(
                                  participant.champion_name.toLowerCase()
                                )}.png`} // URL de l'image du champion
                                alt={participant.champion_name}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <span>{participant.summoner_name}</span>
                            </div>
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

    // Récupérer les statistiques globales
    const statsRes = await axios.get(
      `http://localhost:3000/stats/summoner-id/${summoner_id}`
    );
    const stats = statsRes.data;

    // Récupérer les champion masteries
    const championMasteriesRes = await axios.get(
      `http://localhost:3000/championmastery/summoner/${summoner_id}`
    );
    const championMasteries = championMasteriesRes.data;

    // Ajoutez les champion masteries aux stats
    stats.champion_masteries = championMasteries;

    // Récupérer l'historique des matchs
    const matchHistoryRes = await axios.get(
      `http://localhost:3000/matchparticipant/summoner-id/${summoner_id}`
    );
    const matchHistory = matchHistoryRes.data;

    // Récupérer les participants, les détails du match et les informations du champion pour chaque match
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

        // Récupérer les informations du champion via participant_id
        const championRes = await axios.get(
          `http://localhost:3000/champion/participant/${match.participant_id}`
        );

        return {
          ...match,
          participants: participantsRes.data, // Ajoute les participants au match
          matchDetails: matchDetailsRes.data, // Ajoute les détails du match
          champion: championRes.data, // Ajoute les informations du champion
        };
      })
    );

    // Retourner les données comme props
    return {
      props: {
        summoner,
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