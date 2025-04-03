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
              {Array.isArray(stats.champion_masteries) &&
              stats.champion_masteries.length > 0 ? (
                stats.champion_masteries.map((champion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mt-4 bg-gray-700 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`/img/champion/${
                          championMapping[champion.champion_id] || "default"
                        }.png`}
                        alt={`${
                          championMapping[champion.champion_id] || "Default"
                        } Icon`}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                      <div>
                        <h3 className="text-md font-semibold">
                          {champion.champion_name}
                        </h3>
                        <p className="text-gray-400">
                          {champion.number_of_games} games
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400">{champion.kda} KDA</p>
                      <p className="text-gray-400">
                        {champion.winrate}% Win Rate
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">
                  Aucune statistique de champion disponible.
                </p>
              )}
            </div>
          </div>

          {/* Colonne droite : Historique des matchs */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Match History</h2>
              {Array.isArray(matchHistory) && matchHistory.length > 0 ? (
                matchHistory.map((match, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg mb-4 flex items-center ${
                      match.team_side === match.winning_team_side
                        ? "bg-blue-900"
                        : "bg-red-900"
                    }`}
                  >
                    {/* Colonne gauche : Champion + spells + runes */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={`/img/champion/${removeSpaces(
                            match.champion.champion_name.toLowerCase()
                          )}.png`}
                          alt={`${match.champion.champion_name} Icon`}
                          width={48}
                          height={48}
                          className="rounded-full border-2 border-gray-600"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">
                          {match.champion_level || 18}
                        </span>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <Image
                          src={`/img/spell/Summoner${match.summoner_spells.summoner_spell1_name}.png`}
                          alt="Summoner Spell 1"
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                        <Image
                          src={`/img/spell/Summoner${match.summoner_spells.summoner_spell2_name}.png`}
                          alt="Summoner Spell 2"
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Image
                          src={`/img/rune/Styles/${removeSpaces(match.runes.primary_rune_name)}.png`}
                          alt="Primary Rune"
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                        <Image
                          src={`/img/rune/Styles/${match.runes.secondary_rune_name}.png`}
                          alt="Secondary Rune"
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                      </div>
                    </div>

                    {/* Score */}
                    <div className="ml-4 text-center">
                      <p className="text-lg font-semibold">
                        {match.kills} / {match.deaths} / {match.assists}
                      </p>
                      <p className="text-sm text-gray-400">{match.kda} KDA</p>
                    </div>
                    

                    {/* ESSAI AFFICHAGE SUPPRIMER */}
                    <p>{ `${match.items.item1_name.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9_]/g, "")}.png`}</p>
                    <Image
                      src={`/img/item/${match.items.item1_name.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9_]/g, "")}.png`}
                      alt="Item 1"
                      width={32}
                      height={32}
                      className="rounded-sm"
                    />



                    {/* Items */}
                    <div className="flex-grow flex justify-center space-x-2">
                      {Array.from({ length: 6 }).map((_, idx) => {
                        const itemName = match.items && match.items[idx] ? match.items[idx] : null;
                        const formattedItemName = itemName
                          ? itemName.toLowerCase().replace(/ /g, "_").replace(/[^a-z0-9_]/g, "") // Remplace les espaces par des underscores et supprime les caractères spéciaux
                          : null;
                        return formattedItemName ? (
                          <Image
                            key={idx}
                            src={`/img/item/${match.items.item1_name.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9_]/g, "")}.png`}
                            alt={`Item ${itemName}`}
                            width={32}
                            height={32}
                            className="rounded-sm"
                          />                          
                        ) : (
                          <div
                            key={idx}
                            className="w-8 h-8 bg-gray-700 rounded-sm opacity-50"
                          />
                          
                        );
                        
                      })}
                      {/* Trinket */}
                      {match.items && match.items[6] ? (
                        <Image
                          src={`/img/item/${match.items[6]
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^a-z0-9_]/g, "")}.png`}
                          alt="Trinket"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-700 rounded-sm opacity-50" />
                      )}
                    </div>

                    {/* Participants */}
                    <div className="ml-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        {match.participants
                          .filter((p) => p.team_side === match.team_side)
                          .map((participant, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Image
                                src={`/img/champion/${removeSpaces(
                                  participant.champion_name.toLowerCase()
                                )}.png`}
                                alt={`${participant.champion_name} Icon`}
                                width={18}
                                height={18}
                                className="rounded-full"
                              />
                              <p className="text-gray-300 truncate">
                                {participant.summoner_name}
                              </p>
                            </div>
                          ))}
                      </div>
                      <div>
                        {match.participants
                          .filter((p) => p.team_side !== match.team_side)
                          .map((participant, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Image
                                src={`/img/champion/${removeSpaces(
                                  participant.champion_name.toLowerCase()
                                )}.png`}
                                alt={`${participant.champion_name} Icon`}
                                width={18}
                                height={18}
                                className="rounded-full"
                              />
                              <p className="text-gray-300 truncate">
                                {participant.summoner_name}
                              </p>
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

        // Récupérer les noms des summoner spells via summoner_spell_participant_id
        const summonerSpellsRes = await axios.get(
          `http://localhost:3000/summonerspellparticipant/names/${match.summoner_spell_participant_id}`
        );

        // Récupérer les noms des runes via rune_participant_id
        const runeNamesRes = await axios.get(
          `http://localhost:3000/runeparticipant/names/${match.rune_participant_id}`
        );

        // Récupérer les noms des items via match_participant_id
        const itemsRes = await axios.get(
          `http://localhost:3000/itemparticipant/match/${match.participant_id}`
        );

        return {
          ...match,
          participants: participantsRes.data, // Ajoute les participants au match
          matchDetails: matchDetailsRes.data, // Ajoute les détails du match
          champion: championRes.data, // Ajoute les informations du champion
          runes: runeNamesRes.data, // Ajoute les noms des runes
          items: itemsRes.data, // Ajoute les noms des objets
          summoner_spells: summonerSpellsRes.data, // Ajoute les noms des summoner spells
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
