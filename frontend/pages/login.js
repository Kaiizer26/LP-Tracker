import '/src/app/globals.css';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // Message d'erreur
  const [successMessage, setSuccessMessage] = useState(''); // Message de succès
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Indicateur d'authentification

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Réinitialiser le message d'erreur avant de soumettre
    setSuccessMessage(''); // Réinitialiser le message de succès avant de soumettre

    try {
      const response = await fetch('http://localhost:3002/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Connexion réussie', data);
        setSuccessMessage('Connexion réussie ! Bienvenue ' + data.username);
        setIsAuthenticated(true); // Utilisateur authentifié

        // Vous pouvez rediriger l'utilisateur vers une autre page après la connexion
        // Exemple : window.location.href = '/home';
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error); // Afficher l'erreur retournée par l'API
        console.error('Erreur lors de la connexion:', errorData.error);
      }
    } catch (error) {
      console.error('Erreur de connexion à l\'API:', error);
      setErrorMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
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
          <p className="text-gray-400 text-center mt-2">Ravi de vous revoir !</p>
          
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

            {/* Affichage des messages d'erreur ou de succès */}
            {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}

            {successMessage && (
              <p className="text-green-500 text-center mt-4">{successMessage}</p>
            )}
            
            <button type="submit" className="w-full bg-blue-600 px-4 py-2 rounded-lg mt-4 text-white font-bold">Se connecter</button>
          </form>
          
          <p className="text-gray-400 text-center mt-4">
            Pas encore de compte ? <Link href="/register" className="text-blue-500">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
