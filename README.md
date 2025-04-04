# LP-TRACKER

**LP-TRACKER** est une plateforme de suivi des performances des joueurs de **League of Legends**. Elle permet aux utilisateurs de consulter leurs statistiques, leur historique de matchs, et d'obtenir des informations détaillées sur leurs performances par champion. Ce projet est conçu pour aider les joueurs à mieux comprendre leurs points forts et leurs axes d'amélioration afin de progresser dans le jeu.

## Table des matières

1. [Prérequis]
2. [Installation]
3. [Démarrer l'application]
4. [Endpoints API]
5. [Structure du projet]
6. [Contribuer]
7. [Crédits]

---

## Prérequis

Avant de commencer l'installation, assurez-vous que vous avez installé les outils suivants sur votre machine :

- **Node.js** (version 14 ou supérieure)
- **npm** (version 6 ou supérieure)
- **PostgreSQL** pour la base de données
- **pgAdmin** (optionnel, pour gérer la base de données PostgreSQL)

---

## Technologies utilisées

Le projet **LP-TRACKER** a été développé en utilisant les technologies suivantes :

- **Next.js** : Framework React pour la gestion du frontend et la génération de pages côté serveur (SSR).
- **Express.js** : Framework Node.js pour gérer les routes et la logique du backend.
- **PostgreSQL** : Système de gestion de base de données relationnelle pour stocker les informations des joueurs, des champions, et des matchs.
- **TailwindCSS** : Framework CSS utilitaire pour styliser l'application et offrir une interface moderne et réactive.
- **Axios** : Bibliothèque JavaScript pour faire des requêtes HTTP depuis le frontend et interagir avec l'API.
- **Node.js** : Environnement d'exécution JavaScript pour exécuter le backend.

---

## Installation

1. **Clonez le dépôt Git** :
   ```bash
   git clone https://github.com/username/repository.git
   cd repository
   ```

2. **Installez les dépendances** :
   Assurez-vous d’avoir **Node.js** et **npm** installés sur votre machine, puis exécutez la commande suivante pour installer les dépendances :
   ```bash
   npm install
   ```

3. **Configurez la base de données PostgreSQL** :
   - Créez une base de données **PostgreSQL** et exécutez le fichier SQL d'initialisation de la base de données. Vous pouvez l'importer via **pgAdmin** ou en ligne de commande.
   - **Fichier d'initialisation de la base de données** : `init.sql`
   ```bash
   psql -U username -d your_database_name -a -f init.sql
   ```

4. **Configurer les variables d'environnement** :
   Créez un fichier `.env` à la racine du projet et définissez les variables suivantes :
   ```
   DB_HOST=localhost
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   DB_PORT=5432
   ```

---

## Démarrer l'application

Une fois toutes les dépendances installées et la base de données configurée, vous pouvez démarrer l'application avec la commande suivante :

```bash
cd api/
npx nodemon index.js
```
puis

```bash
cd frontend/
npm run dev
```

L'application sera disponible à l'adresse suivante :

```
http://localhost:3001
```

---

## Endpoints API

Voici les principaux **endpoints** de l'API pour interagir avec l'application **LP-TRACKER** :

1. **Obtenir les informations d'un summoner par son ID**
   - **Méthode HTTP** : `GET`
   - **Endpoint** : `/summoners/summoner-id/{summoner_id}`

2. **Obtenir les statistiques classées d'un summoner**
   - **Méthode HTTP** : `GET`
   - **Endpoint** : `/summoners/summoner-id/{summoner_id}/ranked`

3. **Obtenir l'historique des matchs d'un summoner**
   - **Méthode HTTP** : `GET`
   - **Endpoint** : `/matchparticipant/summoner-id/{summoner_id}`

4. **Ajouter un nouveau champion**
   - **Méthode HTTP** : `POST`
   - **Endpoint** : `/champions`

5. **Mettre à jour un champion**
   - **Méthode HTTP** : `PUT`
   - **Endpoint** : `/champions/{champion_id}`

6. **Supprimer un champion**
   - **Méthode HTTP** : `DELETE`
   - **Endpoint** : `/champions/{champion_id}`

Pour un récapitulatif détaillé des endpoints, vous pouvez consulter l'annexe du rapport ou la documentation dans le dépôt Git.

---

## Structure du projet

Voici un aperçu de la structure du projet **LP-TRACKER** :

```
/LP-TRACKER
  ├── /api               
  │   ├── /models        
  │   ├── /public
  │   ├── /routes             
  │   └── index.js
  │   └── .env          
  ├── /frontend         
  │   ├── /data       
  │   ├── /pages   
  │   ├── /public        
  │   ├── /styles        
  │   ├── /src                
  ├── /init.sql          
  ├── package.json                    
  └── README.md          

```