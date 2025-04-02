import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "/src/app/globals.css";
import Head from "next/head";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [summoners, setSummoners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Message d'erreur
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour vérifier si l'utilisateur est connecté

  // Vérifier si l'utilisateur est connecté dès le chargement de la page
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Vérifier si un token est stocké
    if (token) {
      setIsAuthenticated(true); // L'utilisateur est connecté si le token est trouvé
    }
  }, []); // Ce useEffect se lance au chargement de la page

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Supprimer le token de `localStorage`
    setIsAuthenticated(false); // Mettre à jour l'état pour refléter la déconnexion
    window.location.href = "/"; // Rediriger vers la page d'accueil
  };

  // Gérer le changement de texte dans la barre de recherche
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Gérer la soumission du formulaire de recherche
  const handleSearchSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    if (!searchTerm.trim()) return; // Ignore si le champ est vide

    setLoading(true);
    setError(""); // Réinitialise le message d'erreur avant de chercher
    try {
      // Envoie la requête à l'API pour rechercher un invocateur par son nom
      const response = await axios.get(
        `http://localhost:3002/summoners/summoner-search/${searchTerm}`
      );
      if (response.data.length === 0) {
        setError("Aucun invocateur trouvé avec ce nom.");
      } else {
        setSummoners(response.data); // Si des résultats sont trouvés, les afficher
      }
    } catch (err) {
      setError("Aucun invocateur trouvé avec ce nom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Head>
        <title>LP.Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-transparent fixed w-full top-0 z-50">
        <div className="text-2xl font-bold">LP-TRACKER</div>
        <div>
          {/* Afficher les boutons en fonction de l'état de connexion */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-blue-600 px-4 py-2 rounded-lg ml-2"
            >
              Se déconnecter
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative flex justify-center items-center h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url('/img/aurora-background.jpg')",
        }}
      >
        <div className="relative p-10 rounded-lg text-center w-1/2">
          <h1 className="text-4xl font-bold text-white">LP Tracker</h1>
          <p className="mt-4 text-white">Trackez la personne que vous voulez !</p>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-lg mx-auto mt-6"
          >
            <div className="flex bg-white text-gray-900 p-3 rounded-lg">
              <input
                type="text"
                placeholder="Chercher un joueur"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 outline-none"
              />
              <button
                type="submit"
                className="bg-yellow-500 px-6 py-2 rounded-lg"
              >
                🔍
              </button>
            </div>
          </form>

          {loading && <p className="text-white mt-4">Chargement...</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Affichage des résultats de la recherche */}
          {summoners.length > 0 && (
            <ul className="mt-6">
              {summoners.map((summoner) => (
                <li key={summoner.summoner_id} className="text-white">
                  <Link
                    href={`/ProfilPage/${summoner.summoner_id}`}
                    className="hover:underline"
                  >
                    {summoner.summoner_name}
                  </Link>{" "}
                  - Niveau {summoner.summoner_level}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}