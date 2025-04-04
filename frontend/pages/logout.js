import {useEffect} from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
    const router = useRouter();
    
    useEffect(() => {
        localStorage.removeItem('authtoken'); // Supprime le token du localStorage
        router.push('/login'); // Redirige vers la page d'accueil
    }, [router]);

    return <div>Déconnexion...</div>
}