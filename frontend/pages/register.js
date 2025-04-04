import '/src/app/globals.css';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    password: '',
    user_image: null  // Initialiser comme null, car c'est un fichier
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      // Si c'est un champ de type fichier, on prend le fichier sélectionné
      setFormData({ ...formData, user_image: files[0] });
    } else {
      // Sinon, on met à jour les autres champs de texte
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    setSuccessMessage(''); 

    // Créez une instance de FormData pour envoyer le fichier et autres données
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("user_image", formData.user_image);  // Ajoutez l'image dans FormData

    try {
      const response = await axios.post('http://localhost:3000/users/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'  // Spécifiez que vous envoyez des fichiers
        }
      });
      if (response.status === 201) {
        setSuccessMessage('Inscription réussie ! Vous pouvez vous connecter maintenant.');
        setTimeout(() => {
          router.push('/login'); 
        }, 3000);
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }
  }

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
          
          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}

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

            {/* Sélection d'image de profil */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Image de profil</label>
              <input 
                type="file" 
                name="user_image" 
                onChange={handleChange} 
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none" 
              />
            </div>
            
            <button type="submit" className="w-full bg-red-500 px-4 py-2 rounded-lg mt-4 text-white font-bold">S'inscrire</button>
          </form>
          
          <p className="text-gray-400 text-center mt-4">
            Déjà un compte ? <Link href="/login" className="text-blue-500">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
