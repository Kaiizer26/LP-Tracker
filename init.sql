-- Table des utilisateurs
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, -- Identifiant unique de l'utilisateur
    username VARCHAR(255) UNIQUE NOT NULL, -- Nom d'utilisateur unique
    user_image VARCHAR(255) DEFAULT NULL, -- Image de l'utilisateur (URL ou chemin)
    email VARCHAR(255) UNIQUE NOT NULL, -- Email unique
    password VARCHAR(255) NOT NULL, -- Mot de passe hashé
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);

-- Table des invocateurs (summoners)
CREATE TABLE summoners (
    summoner_id SERIAL PRIMARY KEY, -- Identifiant unique du summoner
    summoner_name VARCHAR(255) UNIQUE NOT NULL, -- Nom d'invocateur unique
    puuid VARCHAR(5) UNIQUE NOT NULL, -- Identifiant unique de Riot (PUUID)
    region VARCHAR(255) NOT NULL, -- Région du joueur (EUW, NA, etc.)
    summoner_icon_id VARCHAR(255) NOT NULL, -- ID de l'icône de profil
    summoner_level INT NOT NULL, -- Niveau du joueur
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);

-- Table des champions
CREATE TABLE champion (
    champion_id SERIAL PRIMARY KEY, -- Identifiant unique du champion
    champion_name VARCHAR(256) UNIQUE NOT NULL, -- Nom du champion
    champion_image VARCHAR(255) NOT NULL, -- Image du champion
    role VARCHAR(255) NOT NULL, -- Rôle du champion (ex: ADC, Support, etc.)
    lore TEXT NOT NULL, -- Histoire du champion
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);

-- Table des matchs
CREATE TABLE matches (
    match_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_duration INT NOT NULL, -- Durée de la partie en secondes (ou autre unité)
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Heure de début
    game_type VARCHAR(50) NOT NULL, -- Type de jeu (par exemple : "Normal", "Ranked", etc.)
    winning_team_side VARCHAR(10) NULL CHECK (winning_team_side IN ('Blue', 'Red', 'None')), -- Côté gagnant (Blue, Red ou None pour un match nul)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) UNIQUE NOT NULL,
    item_image VARCHAR(255) NOT NULL,
    item_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rune (
    rune_id SERIAL PRIMARY KEY,
    rune_name VARCHAR(255) UNIQUE NOT NULL,
    rune_image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spell (
    spell_id SERIAL PRIMARY KEY,
    spell_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    spell_image VARCHAR(255) NOT NULL,
    champion_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (champion_id) REFERENCES champion(champion_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table des équipes
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL,
    team_side VARCHAR(10) NOT NULL CHECK (team_side IN ('Blue', 'Red')), -- Blue ou Red
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE
);
-- Table des participants aux matchs
CREATE TABLE match_participants (
    participant_id SERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL,
    champion_id INT NOT NULL,
    summoner_id INT NOT NULL, -- Lien vers le joueur (summoner)
    team_id INT NOT NULL, -- Lien vers l'équipe à laquelle le joueur appartient
    kills INT NOT NULL DEFAULT 0, -- Kills du joueur dans la game
    deaths INT NOT NULL DEFAULT 0, -- Morts du joueur dans la game
    assists INT NOT NULL DEFAULT 0, -- Assists du joueur dans la game
    kda FLOAT NOT NULL DEFAULT 0.0, -- KDA (Kills + Assists) / Morts
    cs INT NOT NULL DEFAULT 0, -- Creep Score (CS) du joueur
    gold_earned INT NOT NULL DEFAULT 0, -- Or gagné par le joueur
    role VARCHAR(50) NOT NULL, -- Rôle du joueur (Top, Mid, etc.)
    profit INT,  -- Gain ou perte de LP
    summoner_spells VARCHAR(255)[],  -- Tableau de sorts utilisés (par exemple : ["Flash", "Ignite", "Teleport"])
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);



-- Table de maîtrise des champions
CREATE TABLE champion_mastery (
    champion_mastery_id SERIAL PRIMARY KEY, -- Identifiant unique de la maîtrise
    summoner_id INT NOT NULL, -- Référence au summoner
    champion_id INT NOT NULL, -- Référence au champion
    mastery_level INT NOT NULL, -- Niveau de maîtrise du champion
    mastery_points INT NOT NULL, -- Points de maîtrise
    number_of_games INT NOT NULL, -- Nombre de parties jouées avec ce champion
    kills INT DEFAULT 0, -- Nombre de kills total avec ce champion
    deaths INT DEFAULT 0, -- Nombre de morts total avec ce champion
    assists INT DEFAULT 0, -- Nombre d'assistances total avec ce champion
    kda FLOAT DEFAULT 0.0, -- KDA (Kills + Assists) / Morts
    wins INT DEFAULT 0, -- Nombre de victoires avec ce champion
    losses INT DEFAULT 0, -- Nombre de défaites avec ce champion
    winrate INT NOT NULL CHECK (winrate >= 0 AND winrate <= 100), -- Winrate en pourcentage
    lp INT NOT NULL, -- Points de classement (LP) en ranked
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de mise à jour
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE,
    FOREIGN KEY (champion_id) REFERENCES champion(champion_id) ON DELETE CASCADE
);

-- Table des statistiques des joueurs
CREATE TABLE stats (
    stat_id SERIAL PRIMARY KEY, -- Identifiant unique de la statistique
    summoner_id INT NOT NULL, -- Référence au summoner
    solo_ranked_division VARCHAR(50) NOT NULL, -- Rang en soloQ
    solo_lp INT NOT NULL, -- Points de classement en SoloQ (LP)
    flex_ranked_division VARCHAR(50) NOT NULL, -- Rang en Flex
    flex_lp INT NOT NULL, -- Points de classement (LP) en Flex
    winrate INT NOT NULL CHECK (winrate >= 0 AND winrate <= 100), -- Winrate en pourcentage
    solo_wins INT NOT NULL, -- Victoires en solo
    solo_losses INT NOT NULL, -- Défaites en solo
    solo_remakes INT NOT NULL DEFAULT 0, -- Remakes en solo
    flex_wins INT NOT NULL, -- Victoires en flex
    flex_losses INT NOT NULL, -- Défaites en flex
    flex_remakes INT NOT NULL DEFAULT 0, -- Remakes en flex
    kills INT DEFAULT 0, -- Nombre de kills total
    deaths INT DEFAULT 0, -- Nombre de morts total
    assists INT DEFAULT 0, -- Nombre d'assistances total
    kda FLOAT DEFAULT 0.0, -- KDA (Kills + Assists) / Morts
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de mise à jour
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE
);




CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_summoners_puuid ON summoners(puuid);

-- Insérer des utilisateurs
INSERT INTO users (username, user_image, email, password)
VALUES 
('Johan', 'public/img/user1.png', 'johan@gmal.com', 'johan'),
('Jordy', 'public/img/user2.png', 'jordy@gmail.com', 'jordy'),
('Dylan', 'public/img/user3.png', 'dylan@gmail.com', 'dylan');

-- Insérer des invocateurs (summoners)
INSERT INTO summoners (summoner_name, puuid, region, summoner_icon_id, summoner_level)
VALUES 
('IreliaFan123', 'Mvnu', 'EUW', '101', 30),
('depchai', 'EUW', 'NA', '102', 45),
('Kaiizer', '261', 'KR', '103', 50);

-- Insérer des champions
INSERT INTO champion (champion_name, role, lore, champion_image)
VALUES 
('Irelia', 'Mid', 'Irelia est une maîtresse des lames et une combattante redoutable.', 'public/img/irelia.png'),
('Garen', 'Top', 'Garen, le vaillant soldat de Demacia.', 'public/img/garen.png'),
('Jinx', 'ADC', 'Jinx, la folle furieuse, est une criminelle excentrique de Zaun.', 'public/img/jinx.png'),
('Lee Sin', 'Jungle', 'Lee Sin, le moine aveugle, est un maître des arts martiaux.', 'public/img/lee_sin.png'),
('Janna', 'Support', 'Janna, l''esprit des tempêtes, incarne la puissance de la nature.', 'public/img/janna.png');

-- Insérer des matchs
INSERT INTO matches (game_duration, start_time, game_type, winning_team_side)
VALUES 
(1800, '2025-04-01 15:00:00', 'Ranked', 'Blue'),
(2100, '2025-04-02 16:00:00', 'Normal', 'Red'),
(1500, '2025-04-03 17:00:00', 'Ranked', 'Blue');

-- Insérer des équipes
INSERT INTO teams (match_id, team_side)
VALUES 
(1, 'Blue'),
(1, 'Red'),
(2, 'Blue'),
(2, 'Red'),
(3, 'Blue'),
(3, 'Red');

-- Insérer des participants aux matchs
INSERT INTO match_participants (match_id, champion_id, summoner_id, team_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, summoner_spells)
VALUES 
(1, 1, 1, 1, 10, 2, 8, 9.0, 200, 15000, 'Mid', 20, '{"Flash", "Ignite"}'),
(1, 2, 2, 2, 5, 5, 10, 3.0, 180, 12000, 'Top', -15, '{"Flash", "Teleport"}'),
(1, 3, 3, 1, 15, 3, 5, 6.6, 250, 18000, 'ADC', 30, '{"Heal", "Flash"}'),
(2, 4, 1, 3, 8, 4, 12, 5.0, 150, 14000, 'Jungle', 10, '{"Smite", "Flash"}'),
(2, 5, 2, 4, 2, 6, 20, 3.6, 100, 11000, 'Support', -10, '{"Exhaust", "Flash"}'),
(3, 1, 3, 5, 12, 1, 10, 22.0, 300, 20000, 'Mid', 40, '{"Flash", "Ignite"}');

-- Insérer des maîtrises de champions
INSERT INTO champion_mastery (summoner_id, champion_id, mastery_level, mastery_points, number_of_games, kills, deaths, assists, kda, wins, losses, winrate, lp)
VALUES 
(1, 1, 7, 50000, 200, 1000, 500, 800, 3.6, 120, 80, 60, 150),
(2, 3, 6, 40000, 150, 800, 400, 600, 3.5, 90, 60, 60, 120),
(3, 4, 5, 30000, 100, 500, 300, 400, 3.0, 60, 40, 60, 100);

-- Insérer des statistiques des joueurs
INSERT INTO stats (summoner_id, solo_ranked_division, solo_lp, flex_ranked_division, flex_lp, winrate, solo_wins, solo_losses, solo_remakes, flex_wins, flex_losses, flex_remakes, kills, deaths, assists, kda)
VALUES 
(1, 'Gold IV', 50, 'Silver I', 30, 55, 100, 80, 5, 50, 40, 2, 1000, 500, 800, 3.6),
(2, 'Platinum III', 75, 'Gold II', 60, 60, 120, 60, 3, 70, 50, 1, 800, 400, 600, 3.5),
(3, 'Diamond I', 100, 'Platinum IV', 90, 65, 150, 50, 2, 80, 40, 0, 500, 300, 400, 3.0);

-- Insérer des objets
INSERT INTO items (item_name, item_image, item_description, price)
VALUES 
('Infinity Edge', 'public/img/infinity_edge.png', 'Augmente les dégâts critiques.', 3400),
('Rabadon''s Deathcap', 'public/img/rabadons_deathcap.png', 'Augmente la puissance magique.', 3600),
('Thornmail', 'public/img/thornmail.png', 'Renvoie des dégâts aux attaquants.', 2700);

-- Insérer des runes
INSERT INTO rune (rune_name, rune_image, description)
VALUES 
('Conqueror', 'public/img/conqueror.png', 'Augmente les dégâts infligés après plusieurs attaques.'),
('Electrocute', 'public/img/electrocute.png', 'Inflige des dégâts supplémentaires après trois attaques.'),
('Guardian', 'public/img/guardian.png', 'Protège un allié proche.');

-- Insérer des sorts
INSERT INTO spell (spell_name, description, spell_image, champion_id)
VALUES 
('Flash', 'Permet de se téléporter sur une courte distance.', 'public/img/flash.png', 1),
('Ignite', 'Inflige des dégâts sur la durée à un ennemi.', 'public/img/ignite.png', 2),
('Smite', 'Inflige des dégâts aux monstres et aux sbires.', 'public/img/smite.png', 4);