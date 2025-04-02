import '/src/app/globals.css';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);  // Gérer l'affichage des erreurs
  const [success, setSuccess] = useState(null);  // Gérer le message de succès

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);  // Réinitialiser l'erreur avant la soumission
    setSuccess(null);  // Réinitialiser le succès avant la soumission

    try {
      const response = await fetch('http://localhost:3002/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Utilisateur créé', data);

        // Connexion automatique après inscription
        const loginResponse = await fetch('http://localhost:3002/users/login', {  // Assure-toi de l'URL correcte
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('Utilisateur connecté', loginData);

          // Stocker le token dans le localStorage
          localStorage.setItem('authToken', loginData.token);

          // Rediriger après un délai de 3 secondes
          setSuccess("Inscription réussie ! Vous êtes automatiquement connecté. Vous allez être redirigé à l'accueil.");
          setTimeout(() => {
            window.location.href = "/"; // Redirige vers la page d'accueil
          }, 3000);

        } else {
          const errorData = await loginResponse.json();
          setError(errorData.error || "Une erreur s'est produite lors de la connexion.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Une erreur s'est produite lors de l'inscription.");
      }
    } catch (error) {
      console.error('Erreur de connexion à l\'API:', error);
      setError("Erreur de connexion au serveur, veuillez réessayer.");
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
        <title>Inscription - LP.Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="relative w-full max-w-md">
        <Link href="/" className="text-blue-400 text-sm absolute -top-6 left-0">&lt; Retour à l'accueil</Link>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-3xl font-bold text-center">Créer un compte</h2>
          <p className="text-gray-400 text-center mt-2">Rejoignez-nous dès maintenant !</p>
          
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Nom d'utilisateur</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none" 
                placeholder="Entrez votre nom" 
                required 
              />
            </div>
            
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

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            
            <button type="submit" className="w-full bg-red-500 px-4 py-2 rounded-lg mt-4 text-white font-bold">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
}
