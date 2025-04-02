import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Supprimer le token d'authentification du localStorage
    localStorage.removeItem('authToken');
    
    
    router.push('/'); 
  }, [router]);

  return (
    <div className="text-center text-white">
      <h1>Vous êtes déconnecté. Redirection vers l'accueil...</h1>
    </div>
  );
};

export default Logout;
