-- Table des utilisateurs
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, -- Identifiant unique de l'utilisateur
    username VARCHAR(255) UNIQUE NOT NULL, -- Nom d'utilisateur unique
    email VARCHAR(255) UNIQUE NOT NULL, -- Email unique
    password VARCHAR(255) NOT NULL, -- Mot de passe hashé
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Date de mise à jour automatique
);

-- Table des invocateurs (summoners)
CREATE TABLE summoners (
    summoner_id SERIAL PRIMARY KEY, -- Identifiant unique du summoner
    summoner_name VARCHAR(255) UNIQUE NOT NULL, -- Nom d'invocateur unique
    puuid VARCHAR(255) UNIQUE NOT NULL, -- Identifiant unique de Riot (PUUID)
    region VARCHAR(255) NOT NULL, -- Région du joueur (EUW, NA, etc.)
    profile_icon_id VARCHAR(255) NOT NULL, -- ID de l'icône de profil
    summoner_level INT NOT NULL, -- Niveau du joueur
    ranked_division VARCHAR(50) NOT NULL, -- Division classée (ex: Gold, Platinum)
    lp INT NOT NULL -- Nombre de LP (League Points)
);

-- Table des champions
CREATE TABLE champion (
    champion_id SERIAL PRIMARY KEY, -- Identifiant unique du champion
    champion_name VARCHAR(256) UNIQUE NOT NULL, -- Nom du champion
    role VARCHAR(255) NOT NULL, -- Rôle du champion (ex: ADC, Support, etc.)
    lore TEXT NOT NULL, -- Histoire du champion
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Date de mise à jour
    champion_image VARCHAR(255) NOT NULL -- URL ou chemin de l'image du champion
);

-- Table des matchs
CREATE TABLE matches (
    match_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    match_name VARCHAR(255) NOT NULL,                -- Nom du match ou identifiant
    game_duration INT NOT NULL,                      -- Durée de la partie en secondes (ou autre unité)
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Heure de début
    -- end_time TIMESTAMP,                             -- Heure de fin
    result ENUM('Win', 'Loss', 'Draw', 'Remake') NOT NULL,  -- Résultat global de la game
    game_type VARCHAR(50) NOT NULL,                  -- Type de jeu (par exemple : "Normal", "Ranked", etc.)
    winning_team_side ENUM('Blue', 'Red', 'None') NULL, -- Côté gagnant (Blue ou Red, ou "None" pour un match nul)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des participants aux matchs
CREATE TABLE match_participants (
    participant_id SERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL,
    summoner_id INT NOT NULL,          -- Lien vers le joueur (summoner)
    team_id INT NOT NULL,              -- Lien vers l'équipe à laquelle le joueur appartient
    kills INT NOT NULL DEFAULT 0,      -- Kills du joueur dans la game
    deaths INT NOT NULL DEFAULT 0,     -- Morts du joueur dans la game
    assists INT NOT NULL DEFAULT 0,    -- Assists du joueur dans la game
    gold_earned INT NOT NULL DEFAULT 0, -- Or gagné par le joueur
    role VARCHAR(50) NOT NULL,         -- Rôle du joueur (Top, Mid, etc.)
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

-- Table des équipes
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL,
    team_name VARCHAR(255) NOT NULL,  -- Nom de l'équipe (Blue, Red, etc.)
    team_side ENUM('Blue', 'Red') NOT NULL,  -- Blue ou Red, ou plus si besoin
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE
);

-- Table de maîtrise des champions
CREATE TABLE champion_mastery (
    champion_mastery_id SERIAL PRIMARY KEY, -- Identifiant unique de la maîtrise
    summoner_id INT NOT NULL, -- Référence au summoner
    champion_id INT NOT NULL, -- Référence au champion
    mastery_level INT NOT NULL, -- Niveau de maîtrise du champion
    mastery_points INT NOT NULL, -- Points de maîtrise
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (champion_id) REFERENCES champion(champion_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table des statistiques des joueurs
CREATE TABLE stats (
    stat_id SERIAL PRIMARY KEY, -- Identifiant unique de la statistique
    summoner_id INT NOT NULL, -- Référence au summoner
    region VARCHAR(255) NOT NULL, -- Région du joueur
    solo_rank VARCHAR(50) NOT NULL, -- Rang en soloQ
    flex_rank VARCHAR(50) NOT NULL, -- Rang en Flex
    solo_wins INT NOT NULL, -- Victoires en solo
    solo_losses INT NOT NULL, -- Défaites en solo
    solo_remakes INT NOT NULL DEFAULT 0, -- Remakes en solo
    flex_wins INT NOT NULL, -- Victoires en flex
    flex_losses INT NOT NULL, -- Défaites en flex
    flex_remakes INT NOT NULL DEFAULT 0, -- Remakes en flex
    kills INT DEFAULT 0, -- Nombre de kills total
    deaths INT DEFAULT 0, -- Nombre de morts total
    assists INT DEFAULT 0, -- Nombre d'assistances total
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table des objets (items)
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY, -- Identifiant unique de l'objet
    item_name VARCHAR(255) UNIQUE NOT NULL, -- Nom de l'objet
    description TEXT NOT NULL, -- Description de l'objet
    price INT NOT NULL CHECK (price >= 0), -- Prix de l'objet (doit être positif)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des runes
CREATE TABLE rune (
    rune_id SERIAL PRIMARY KEY, -- Identifiant unique de la rune
    rune_name VARCHAR(255) UNIQUE NOT NULL, -- Nom de la rune
    description TEXT NOT NULL, -- Description de la rune
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des sorts (spells)
CREATE TABLE spell (
    spell_id SERIAL PRIMARY KEY, -- Identifiant unique du sort
    champion_id INT NOT NULL, -- Référence au champion possédant ce sort
    spell_name VARCHAR(255) NOT NULL, -- Nom du sort
    description TEXT NOT NULL, -- Description du sort
    spell_picture VARCHAR(255) NOT NULL, -- Image du sort
    spell_type ENUM('Q', 'W', 'E', 'R', 'P') NOT NULL, -- Type du sort
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (champion_id) REFERENCES champion(champion_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table des amis (friends)
CREATE TABLE friends (
    user_id1 INT NOT NULL,
    user_id2 INT NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id1, user_id2),
    FOREIGN KEY (user_id1) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id2) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Création des index pour améliorer les performances
CREATE INDEX idx_summoners_puuid ON summoners(puuid);
CREATE INDEX idx_matches_summoner_id ON matches(match_id);
CREATE INDEX idx_matches_champion_id ON matches(match_id);
CREATE INDEX idx_match_participant_match_id ON match_participants(match_id);
CREATE INDEX idx_match_participant_summoner_id ON match_participants(summoner_id);
CREATE INDEX idx_match_participant_champion_id ON match_participants(summoner_id);
