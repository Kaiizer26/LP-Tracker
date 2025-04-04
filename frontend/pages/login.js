import '/src/app/globals.css';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Réinitialise les erreurs
    setSuccessMessage('');  // Réinitialise les succès

    try {
      const response = await axios.post('http://localhost:3000/users/login', formData);

      // En cas de succès, on stocke le token dans le localStorage
      localStorage.setItem('authToken', response.data.token);
      setSuccessMessage('Connexion réussie !');

      // Rediriger vers la page d'accueil après 3 secondes
      setTimeout(() => router.push('/'), 3000);

    } catch (error) {
      // Vérification de la présence d'une erreur spécifique dans la réponse
      if (error.response) {
        // Si la réponse contient des informations d'erreur, on les affiche
        setErrorMessage(error.response.data.error || 'Erreur inconnue');
      } else {
        // Sinon, message générique d'erreur
        setErrorMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
      }
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <div className="text-white min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url('/img/teemo-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Head>
        <title>Connexion - LP.Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="relative w-full max-w-md">
        <Link href="/" className="text-blue-400 text-sm absolute -top-6 left-0">&lt; Retour à l'accueil</Link>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-3xl font-bold text-center">Se connecter</h2>
          <p className="text-gray-400 text-center mt-2">Bienvenue de retour !</p>

          {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}  {/* Affichage des erreurs */}
          {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}  {/* Affichage du succès */}

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none"
                placeholder="Entrez votre email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            <button type="submit" className="w-full bg-red-500 px-4 py-2 rounded-lg mt-4 text-white font-bold">
              Se connecter
            </button>
          </form>

          <p className="text-gray-400 text-center mt-4">
            Pas encore de compte ? <Link href="/register" className="text-blue-500">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
