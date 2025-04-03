-- Table des utilisateurs
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, -- Identifiant unique de l'utilisateur
    username VARCHAR(255) UNIQUE NOT NULL, -- Nom d'utilisateur unique
    user_image VARCHAR(255) DEFAULT NULL, -- Image de l'utilisateur (URL ou chemin)
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'), -- Email unique
    password VARCHAR(255) NOT NULL, -- Mot de passe hashé
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);

-- Table des invocateurs (summoners)
CREATE TABLE summoners (
    summoner_id SERIAL PRIMARY KEY, -- Identifiant unique du summoner
    summoner_name VARCHAR(255) UNIQUE NOT NULL, -- Nom d'invocateur unique
    puuid VARCHAR(5) NOT NULL, -- Identifiant unique de Riot (PUUID)
    region VARCHAR(255) NOT NULL, -- Région du joueur (EUW, NA, etc.)
    summoner_icon_id VARCHAR(255) NOT NULL, -- ID de l'icône de profil
    summoner_level INT NOT NULL, -- Niveau du joueur
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);

-- Table des champions
CREATE TABLE champions (
    champion_id SERIAL PRIMARY KEY, -- Identifiant unique du champion
    champion_name VARCHAR(256) UNIQUE NOT NULL, -- Nom du champion
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
    game_type VARCHAR(50) NOT NULL CHECK(game_type IN ('Normal', 'Ranked Solo', 'Ranked Flex', 'Swiftplay', 'Aram')), -- Type de jeu (par exemple : "Normal", "Ranked", etc.)
    winning_team_side VARCHAR(10) NULL CHECK (winning_team_side IN ('Blue', 'Red', 'None')), -- Côté gagnant (Blue, Red ou None pour un match nul)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) UNIQUE NOT NULL,
    item_description TEXT NOT NULL,
    price INT NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items_participants(
	item_participant_id SERIAL PRIMARY KEY,
	item1_id INT DEFAULT NULL,
	item2_id INT DEFAULT NULL,
	item3_id INT DEFAULT NULL,
	item4_id INT DEFAULT NULL,
	item5_id INT DEFAULT NULL,
	item6_id INT DEFAULT NULL,
	item_vision_id INT NOT NULL,
	FOREIGN KEY (item1_id) REFERENCES items(item_id) ON DELETE CASCADE,
	FOREIGN KEY (item2_id) REFERENCES items(item_id) ON DELETE CASCADE,
	FOREIGN KEY (item3_id) REFERENCES items(item_id) ON DELETE CASCADE,
	FOREIGN KEY (item4_id) REFERENCES items(item_id) ON DELETE CASCADE,
	FOREIGN KEY (item5_id) REFERENCES items(item_id) ON DELETE CASCADE,
	FOREIGN KEY (item6_id) REFERENCES items(item_id) ON DELETE CASCADE,
	FOREIGN KEY (item_vision_id) REFERENCES items(item_id) ON DELETE CASCADE
);
CREATE TABLE runes (
    rune_id SERIAL PRIMARY KEY,
    rune_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE runes_participants(
	runes_participant_id SERIAL PRIMARY KEY,
	rune1_id INT NOT NULL,
	rune2_id INT NOT NULL,
	FOREIGN KEY (rune1_id) REFERENCES runes(rune_id) ON DELETE CASCADE,
	FOREIGN KEY (rune2_id) REFERENCES runes(rune_id) ON DELETE CASCADE
);

CREATE TABLE spells (
    spell_id SERIAL PRIMARY KEY,
    spell_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    champion_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (champion_id) REFERENCES champions(champion_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE summoner_spells_participants(
	summoner_spell_participant_id SERIAL PRIMARY KEY,
	summoner_spell1_id INT NOT NULL,
	summoner_spell2_id INT NOT NULL,
	FOREIGN KEY (summoner_spell1_id) REFERENCES spells(spell_id) ON DELETE CASCADE,
	FOREIGN KEY (summoner_spell2_id) REFERENCES spells(spell_id) ON DELETE CASCADE
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
	item_participant_id INT NOT NULL, -- Lien vers les items auquel le joueur possède 
	rune_participant_id INT NOT NULL, -- Lien vers les runes choisies par le personnage
	summoner_spell_participant_id INT NOT NULL,
    kills INT NOT NULL DEFAULT 0, -- Kills du joueur dans la game
    deaths INT NOT NULL DEFAULT 0, -- Morts du joueur dans la game
    assists INT NOT NULL DEFAULT 0, -- Assists du joueur dans la game
    kda FLOAT NOT NULL DEFAULT 0.0, -- KDA (Kills + Assists) / Morts
    cs INT NOT NULL DEFAULT 0, -- Creep Score (CS) du joueur
    gold_earned INT NOT NULL DEFAULT 0, -- Or gagné par le joueur
    role VARCHAR(50) NOT NULL, -- Rôle du joueur (Top, Mid, etc.)
    profit INT,  -- Gain ou perte de LP
	damage INT NOT NULL DEFAULT 0,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (item_participant_id) REFERENCES items_participants(item_participant_id) ON DELETE CASCADE,
	FOREIGN KEY (rune_participant_id) REFERENCES runes_participants(runes_participant_id) ON DELETE CASCADE

);



-- Table de maîtrise des champions
CREATE TABLE champion_masteries (
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
    lp INT NOT NULL, -- Points de classement (LP) gagnés ou perdus en ranked avec un personnage
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de mise à jour
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE,
    FOREIGN KEY (champion_id) REFERENCES champions(champion_id) ON DELETE CASCADE
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
('depchai', 'VTN', 'NA', '102', 45),
('Kaiizer', '261', 'KR', '103', 50),
('joepok', 'pok', 'EUW', '104', 60),
('joe', 'lok', 'NA', '105', 35),
('RivenMaster', 'UIP', 'KR', '106', 40),
('joelacitrouille', 'def', 'EUW', '107', 55),
('blackfire', 'fer', 'NA', '108', 38),
('johnlenoob', 'clo', 'KR', '109', 48),
('manuetgit', 'help', 'EUW', '110', 42),
('LeeSinGod', 'pqrp', 'NA', '111', 65),
('speed', 'stue', 'KR', '112', 47),
('coxmort', '7456', 'NA', '108', 38),
('ozeki', 'clo', 'KR', '109', 48),
('ifa', 'help', 'EUW', '110', 42),
('gazy', 'pqrp', 'NA', '111', 65),
('LawJager', 'stue', 'KR', '112', 47),
('donotdisturb', 'dont', 'NA', '108', 38),
('Landysoussmurf', '261', 'KR', '109', 48),
('chakou', 'chs', 'EUW', '113', 33);

-- Insérer des champions
INSERT INTO champions (champion_name, role, lore)
VALUES 
('Irelia', 'Mid', 'Irelia est une maîtresse des lames et une combattante redoutable.'),
('Garen', 'Top', 'Garen, le vaillant soldat de Demacia.'),
('Jinx', 'ADC', 'Jinx, la folle furieuse, est une criminelle excentrique de Zaun.'),
('Janna', 'Support', 'Janna, l''esprit des tempêtes, incarne la puissance de la nature.'),
('Lee Sin', 'Jungle', 'Lee Sin, le moine aveugle, est un maître des arts martiaux.'),
('Ahri', 'Mid', 'Ahri, la renarde à neuf queues, séduit ses ennemis avec ses charmes et sa magie.'),
('Yasuo', 'Mid', 'Yasuo, le vagabond sans maître, est un épéiste exceptionnel qui défie les vents.'),
('Thresh', 'Support', 'Thresh, le gardien des âmes, collecte les âmes des défunts dans sa lanterne.'),
('Riven', 'Top', 'Riven, l''exilé de Noxus, cherche la rédemption pour ses actes passés.'),
('Katarina', 'Mid', 'Katarina, la lame noxienne, est une assassin impitoyable.'),
('Miss Fortune', 'ADC', 'Miss Fortune, la pistolère implacable, cherche à venger la mort de sa famille.'),
('Vayne', 'ADC', 'Vayne, la chasseuse nocturne, traque les créatures des ténèbres.'),
('Zed', 'Mid', 'Zed, le maître des ombres, utilise les arts sombres pour manipuler la réalité.'),
('Sivir', 'ADC', 'Sivir, la reine des combats, est une mercenaire experte maniant une épée gigantesque.'),
('Ekko', 'Mid', 'Ekko, le prodige de Zaun, manipule le temps à sa guise.'),
('Shaco', 'Jungle', 'Shaco, le démon du rire, sème la terreur dans les ombres.'),
('Nautilus', 'Support', 'Nautilus, le titan des profondeurs, protège les mers avec son ancre.'),
('Darius', 'Top', 'Darius, la main de Noxus, écrase ses ennemis avec sa hache massive.'),
('Teemo', 'Top', 'Teemo, l''éclaireur rapide, utilise des champignons toxiques pour piéger ses adversaires.'),
('Morgana', 'Support', 'Morgana, la mage déchue, lutte entre ténèbres et lumière.'),
('Draven', 'ADC', 'Draven, le glorieux exécuteur, adore le spectacle du combat.'),
('Warwick', 'Jungle', 'Warwick, la bête sanguinaire, traque ses proies avec un instinct bestial.'),
('Fiora', 'Top', 'Fiora, la duelliste, est l''épéiste la plus redoutée de Demacia.'),
('Talon', 'Mid', 'Talon, l''ombre de Noxus, frappe ses cibles sans laisser de trace.'),
('Malphite', 'Top', 'Malphite, le fragment du monolithe, est un être massif de pierre vivante.'),
('Kha''Zix', 'Jungle', 'Kha''Zix, l''évolution vivante, s''adapte et évolue pour devenir plus dangereux.');

-- Insérer des objets
INSERT INTO items (item_name, item_description, price)
VALUES 
('Infinity Edge', 'Augmente les dégâts critiques.', 3400),
('Rabadon''s Deathcap', 'Augmente la puissance magique.', 3600),
('Thornmail', 'Renvoie des dégâts aux attaquants.', 2700),
('Blade of the Ruined King', 'Inflige des dégâts basés sur la vie de l''ennemi et soigne l''utilisateur.', 3400),
('The Bloodthirster', 'Augmente les dégâts d''attaque et confère du vol de vie.', 3500),
('Zhonya''s Hourglass', 'Permet de se rendre invulnérable pendant un court laps de temps.', 3000),
('Guardian Angel', 'Restaure la vie du porteur après sa mort.', 2800),
('Sunfire Aegis', 'Inflige des dégâts autour du porteur.', 3200),
('Mercurial Scimitar', 'Permet de se débarrasser des effets de contrôle de foule.', 3400),
('Luden''s Echo', 'Inflige des dégâts supplémentaires et génère de la mana.', 3000),
('Frozen Heart', 'Réduit la vitesse d''attaque des ennemis proches.', 2900),
('Mortal Reminder', 'Réduit les soins reçus par les ennemis.', 2800),

-- Items magiques
('Luden''s Tempest', 'Inflige des dégâts supplémentaires à l''ennemi et génère de la mana à chaque sort lancé.', 3200),
('Leandre''s Anguish', 'Inflige des dégâts magiques sur le long terme et augmente la puissance magique.', 2900),
('Morellonomicon', 'Réduit la régénération de santé des ennemis et accorde de la puissance magique.', 2800),

-- Items tank
('Warmog''s Armor', 'Accorde une régénération de vie massive en dehors des combats.', 3000),
('Randuin''s Omen', 'Réduit la vitesse d''attaque des ennemis proches et leur inflige des dégâts.', 2900),
('Gargoyle Stoneplate', 'Augmente la résistance du porteur contre les dégâts physiques et magiques.', 2700),

-- Items tireur
('Kraken Slayer', 'Inflige des dégâts supplémentaires sur les ennemis en fonction de leur vie maximale.', 3200),
('Galeforce', 'Permet de s''échapper ou de se repositionner rapidement tout en infligeant des dégâts.', 2900),
('Essence Reaver', 'Accorde de la régénération de mana et améliore les dégâts critiques.', 2800),

-- Items support
('Redemption', 'Soigne les alliés proches et accorde un bonus de régénération de vie.', 2500),
('Locket of the Iron Solari', 'Accorde un bouclier aux alliés proches pour les protéger des dégâts.', 2300),
('Mikael''s Blessing', 'Permet d''enlever les effets de contrôle de foule et soigne le porteur.', 2300),

-- Items incomplets
('Health Potion', 'Restaure de la santé en consommant la potion.', 50),
('Mana Potion', 'Restaure de la mana en consommant la potion.', 50),
('Boots of Speed', 'Accorde une augmentation de la vitesse de déplacement.', 300),
('Ornate Pickaxe', 'Augmente les dégâts physiques, utilisé pour fabriquer des items ultérieurs.', 875),
('Doran''s Blade', 'Augmente les dégâts d''attaque et la vie.', 450),
('Doran''s Shield', 'Augmente la régénération de vie et fournit de la résistance aux dégâts.', 450),
('Doran''s Ring', 'Augmente la puissance magique et la régénération de mana.', 450),
('Boots of Swiftness', 'Accorde une grande augmentation de la vitesse de déplacement.', 1000),
('Orb of Oblivion', 'Réduit les soins reçus par l''ennemi.', 1000),

-- Items de vision
('Control Ward', 'Permet de détecter et détruire les wards ennemies dans une zone autour de lui.', 75),
('Oracle Lens', 'Permet de révéler les wards et pièges ennemis dans un rayon spécifique.', 75),
('Sightstone', 'Donne la possibilité de poser des wards de vision.', 800),
('Raptor Cloak', 'Un objet de vision pour la jungle, révèle les camps ennemis et détecte les wards ennemies.', 600),
('Farsight Alteration', 'Permet de poser des wards de vision longue portée à distance.', 400),
('Scanner', 'Permet de révéler les zones autour du joueur pour détecter les ennemis invisibles.', 250); --39

-- Insérer des runes
INSERT INTO runes (rune_name, description)
VALUES 
('Conqueror', 'Augmente les dégâts infligés après plusieurs attaques.'),
('Electrocute', 'Inflige des dégâts supplémentaires après trois attaques.'),
('Guardian', 'Protège un allié proche.'),
('Fleet Footwork', 'Génère de la vitesse de déplacement et soigne l''utilisateur après des attaques.'),
('Press the Attack', 'Inflige des dégâts supplémentaires après trois attaques sur un ennemi.'), -- 5
('Unflinching', 'Réduit les effets de contrôle de foule et augmente la résistance aux ralentissements.'),
('Phase Rush', 'Augmente la vitesse de déplacement après avoir touché un ennemi avec des attaques ou des compétences.'),
('Summon Aery', 'Lance un esprit qui inflige des dégâts ou protège un allié.'),
('Dark Harvest', 'Inflige des dégâts supplémentaires à un ennemi faible et stocke de l''énergie pour de futures attaques.'),
('Lethal Tempo', 'Augmente la vitesse d''attaque après avoir attaqué plusieurs fois.'), -- 10
('Précision',  'Amélioration des attaques et des dégâts soutenus'),
('Domination', 'Dégâts en rafale et accès aux cibles'),
('Sorcellerie', 'Capacités renforcées et manipulation des ressources.'),
('Résolution', 'Durabilité et contrôle de foule'),
('Inspiration ', 'Outils créatifs et contournement des règles');

-- Insérer des sorts
INSERT INTO spells (spell_name, description, champion_id)
VALUES 
('Flash', 'Permet au champion de se téléporter instantanément à un endroit proche.', null),
('Ignite', 'Inflige des dégâts au fil du temps à un ennemi et réduit ses soins.', null),
('Ghost', 'Permet au champion de se déplacer à une vitesse accrue pendant un certain temps.', null),
('Teleport', 'Permet au champion de se téléporter sur un site allié, généralement une tourelle ou un minion.', null),
('Smite', 'Inflige des dégâts à un monstre ou un ennemi cible et lui inflige des effets supplémentaires.', null),
('Heal', 'Soigne un allié ou le champion lui-même et leur accorde un bonus temporaire de vitesse de déplacement.', null),
('Barrier', 'Accorde un bouclier temporaire qui absorbe les dégâts.', null),
('Exhaust', 'Réduit la vitesse de déplacement et les dégâts d’un ennemi ciblé pendant un certain temps.', null),
('Cleanse', 'Enlève tous les effets de contrôle de foule (CC) d’un champion.', null), -- 9

-- Sort de personnage 

('Transfusion', 'Vladimir pompe la vie de ses ennemis, leur infligeant des dégâts et se soignant.', 1),
('Tides of Blood', 'Vladimir consomme de la santé pour infliger des dégâts en fonction de la cible et de la quantité de sang accumulé.', 1),
('Hemoplague', 'Vladimir infecte les ennemis dans une zone, infligeant des dégâts au fil du temps.', 1),
('Sanguine Pool', 'Vladimir se transforme en pool de sang, devenant invulnérable et ralentissant les ennemis autour de lui.', 1),
('Make it Rain', 'Miss Fortune tire une pluie de balles qui ralentit et inflige des dégâts dans une zone.', 2),
('Double Up', 'Miss Fortune tire deux balles, la seconde infligeant des dégâts supplémentaires si elle touche.', 2),
('Bullet Time', 'Miss Fortune libère un spray de balles dans une large zone, infligeant des dégâts à tous les ennemis dans la trajectoire.', 2),
('Strut', 'Miss Fortune gagne de la vitesse de déplacement et devient plus efficace dans ses attaques.', 2),
('Noxian Guillotine', 'Renekton attaque avec une grande force, infligeant de lourds dégâts à un ennemi ciblé.', 3),
('Ruthless Predator', 'Renekton frappe violemment un ennemi, le stunnant et infligeant des dégâts supplémentaires.', 3),
('Slice and Dice', 'Renekton effectue une attaque rapide avec son sabre et se déplace instantanément.', 3),
('Dominus', 'Renekton se transforme en une forme plus puissante, augmentant sa taille, ses dégâts et sa régénération de santé.', 3),
('Piercing Darkness', 'Thresh lance un éclair qui traverse les ennemis et les soigne pour une partie des dégâts infligés.', 4),
('Death Sentence', 'Thresh lance sa lanterne vers un ennemi et le tire vers lui, le piégeant.', 4),
('The Box', 'Thresh crée une zone piégée, ralentissant et infligeant des dégâts à ceux qui la traversent.', 4),
('Flay', 'Thresh attaque une zone autour de lui et projette les ennemis dans une direction choisie.', 4),
('Jhin - Deadly Flourish', 'Jhin tire un projectile qui enraye un ennemi et inflige des dégâts.', 5),
('Jhin - Captive Audience', 'Jhin place un piège qui explose au contact d''un ennemi, infligeant des dégâts et ralentissant.', 5),
('Jhin - Four Shot', 'Jhin tire une balle à la quatrième attaque, infligeant des dégâts massifs à son ennemi.', 5),
('Jhin - Charmed', 'Jhin utilise ses charmes pour envoûter ses ennemis et les amener vers lui.', 5);

-- Insérer des matchs
INSERT INTO matches (game_duration, start_time, game_type, winning_team_side)
VALUES 
(1800, '2025-04-01 15:00:00', 'Ranked Solo', 'Blue'),
(2100, '2025-04-02 16:00:00', 'Normal', 'Red'),
(1500, '2025-04-03 17:00:00', 'Ranked Flex', 'Blue'),
(2000, '2025-04-04 18:30:00', 'Swiftplay', 'Red'),
(2200, '2025-04-05 19:45:00', 'Ranked Flex', 'Blue'),
(1800, '2025-04-06 14:00:00', 'Normal', 'Red'),
(2100, '2025-04-07 20:30:00', 'Ranked Solo', 'Blue'),
(2400, '2025-04-08 13:15:00', 'Normal', 'Red'),
(1900, '2025-04-09 22:00:00', 'Ranked Solo', 'Blue'),
(2100, '2025-04-10 11:30:00', 'Ranked Solo', 'Red'),
(2300, '2025-04-11 16:00:00', 'Ranked Solo', 'Blue'),
(2000, '2025-04-12 15:30:00', 'Normal', 'Red');

-- Insérer des équipes
INSERT INTO teams (match_id, team_side)
VALUES 
(1, 'Blue'),
(1, 'Red'),
(2, 'Blue'),
(2, 'Red'),
(3, 'Blue'),
(3, 'Red'),
(4, 'Blue'),
(4, 'Red'),
(5, 'Blue'),
(5, 'Red'),
(6, 'Blue'),
(6, 'Red');


--Insérer des sets d'objets d'un joueur d'un match
INSERT INTO items_participants(item1_id, item2_id, item3_id, item4_id, item5_id, item6_id, item_vision_id)
VALUES

(30, 29, 28, NULL, NULL, NULL, 35),
(13, 32, 28, null, null, null, 36),
(31, 34, 28, null, null, null, 37),
(23, 25, 33, null, null, null, 39),
(30, 34, 29, null, null, null, 35),
(30, 29, 28, null, null, null, 35),  -- ADC (early game)
(13, 32, 28, null, null, null, 36),  -- Mage (early game)
(31, 34, 28, null, null, null, 37),  -- Tank (early game)
(23, 25, 33, null, null, null, 39),  -- Support (mid game)
(30, 34, 29, null, null, null, 35),  -- Jungler (mid game) 10
(1, 5, 7, null, null, null, 39),  -- ADC (late game)
(8, 17, 19, null, null, null, 38),  -- Tank (late game)
(20, 21, 22, null, null, null, 35),  -- ADC (mid game)
(16, 17, 18, null, null, null, 37),  -- Tank (mid game)
(6, 7, 8, null, null, null, 36),  -- Mage (mid game)
(10, 14, 15, null, null, null, 39),  -- Mage (late game)
(9, 11, 12, null, null, null, 38),  -- ADC (mid game)
(8, 16, 19, null, null, null, 37),  -- Tank (late game)
(23, 25, 28, null, null, null, 39),  -- Support (late game)
(1, 9, 13, null, null, null, 36),  -- ADC (early game)
(30, 28, 29, null, null, null, 35),  -- ADC (early game)
(31, 34, 28, null, null, null, 37),  -- Tank (early game)
(6, 7, 8, null, null, null, 39),  -- Mage (mid game)
(19, 20, 21, null, null, null, 38),  -- Tank (mid game)
(18, 20, 21, null, null, null, 39),  -- Tank (late game)
(1, 5, 7, null, null, null, 39),  -- ADC (late game)
(8, 17, 19, null, null, null, 35),  -- Tank (mid game)
(6, 13, 15, null, null, null, 38),  -- Mage (late game)
(23, 25, 28, null, null, null, 37);  -- Support (late game) 29


-- Insérer des runes faites par le joueur participant d'un match
INSERT INTO runes_participants(rune1_id, rune2_id)
VALUES
(1, 13),
(7, 11),
(2, 13),
(6, 11),
(10, 14),
(8, 11),
(3, 11),
(4, 15),
(5, 12),
(9, 15);


INSERT INTO summoner_spells_participants(summoner_spell1_id, summoner_spell2_id)
VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6), -- 5
(1, 7),
(1, 8),
(1, 9),
(3, 2),
(2, 4), -- 10
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(3, 4),
(7, 1),
(9, 1); -- 17



INSERT INTO match_participants (match_id, champion_id, summoner_id, team_id, item_participant_id, rune_participant_id, summoner_spell_participant_id, kills, deaths, assists, kda, cs, gold_earned, role, profit, damage)
VALUES 
-- Match 1
(1, 1, 1, 1, 1, 1, 1, 10, 2, 8, 9.0, 200, 15000, 'Mid', 20, 75125), --1,2,3,4 déjà fait 5,6,7 nouveau, dernier : 16 (damage)
(1, 2, 2, 2, 2, 2, 3, 5, 5, 10, 3.0, 180, 12000, 'Top', -15, 14710),
(1, 3, 3, 1, 3, 3, 2, 15, 3, 5, 6.6, 250, 18000, 'ADC', 30, 5426),
(1, 4, 4, 2, 4, 4, 4, 8, 4, 12, 5.0, 150, 14000, 'Jungle', -10, 121110),
(1, 5, 5, 1, 5, 5, 5, 2, 6, 20, 3.6, 100, 11000, 'Support', 19, 79386),
(1, 6, 6, 2, 6, 6, 6, 12, 1, 10, 22.0, 300, 20000, 'Mid', -20, 31157),
(1, 7, 7, 1, 7, 7, 7, 8, 3, 7, 5.0, 220, 16000, 'Top', 25, 89757),
(1, 8, 8, 2, 8, 8, 8, 10, 4, 9, 4.75, 210, 14500, 'ADC', -15, 13834),
(1, 9, 9, 1, 9, 9, 9, 5, 2, 14, 9.5, 230, 17000, 'Jungle', 30, 5301),
(1, 10, 10, 2, 10, 1, 10, 3, 3, 15, 6.0, 180, 13000, 'Support', -5, 52349),

-- Match 2
(2, 11, 11, 3, 11, 8, 12, 12, 2, 8, 10.0, 250, 15500, 'Mid', -35, 12802),
(2, 12, 12, 4, 12, 7, 11, 7, 4, 9, 4.0, 190, 12000, 'Top', 10, 68656),
(2, 13, 13, 3, 13, 6, 17, 14, 1, 12, 26.0, 300, 21000, 'ADC', -50, 37555),
(2, 14, 14, 4, 14, 5, 15, 6, 5, 10, 3.2, 160, 13500, 'Jungle', 20, 46513),
(2, 15, 15, 3, 15, 2, 5, 4, 6, 15, 4.0, 140, 11500, 'Support', -15, 88191),
(2, 16, 16, 4, 16, 1, 9, 11, 3, 9, 7.0, 220, 16500, 'Mid', 20, 2952),
(2, 17, 17, 3, 17, 8, 7, 9, 4, 8, 3.5, 200, 15000, 'Top', -10, 61771),
(2, 18, 18, 4, 18, 4, 12, 13, 2, 11, 6.5, 240, 17500, 'ADC', 5 , 98545),
(2, 19, 19, 3, 19, 3, 2, 7, 3, 12, 4.0, 180, 12500, 'Jungle', -15, 7792),
(2, 20, 20, 4, 20, 8, 9, 5, 4, 14, 3.0, 160, 13000, 'Support', 20 , 75636),

-- Match 3
(3, 2, 11, 3, 21, 5, 5, 12, 2, 8, 10.0, 250, 15500, 'Mid', 35, 106704),
(3, 3, 12, 4, 22, 2, 19, 7, 4, 9, 4.0, 190, 12000, 'Top', -10, 35635),
(3, 4, 13, 3, 23, 9, 18, 14, 1, 12, 26.0, 300, 21000, 'ADC', 50, 44544),
(3, 5, 14, 4, 24, 4, 4, 6, 5, 10, 3.2, 160, 13500, 'Jungle', -20, 26925),
(3, 15, 15, 3, 25, 6, 6, 4, 6, 15, 4.0, 140, 11500, 'Support', 15, 92661),
(3, 8, 16, 4, 26, 9, 9, 11, 3, 9, 7.0, 220, 16500, 'Mid', -20, 78175),
(3, 17, 17, 3, 27, 1, 1, 9, 4, 8, 3.5, 200, 15000, 'Top', 10, 69559),
(3, 10, 18, 4, 28, 4, 3, 13, 2, 11, 6.5, 240, 17500, 'ADC', -5 , 8939),
(3, 9, 19, 3, 29, 5, 11, 7, 3, 12, 4.0, 180, 12500, 'Jungle', 15, 86616),
(3, 12, 20, 4, 15, 4, 13, 5, 4, 14, 3.0, 160, 13000, 'Support', -20 , 52466),

-- Match 4
(4, 9, 10, 3, 12, 5, 14, 12, 2, 8, 10.0, 250, 15500, 'Mid', -35, 11039),
(4, 11, 8, 4, 2, 6, 3, 7, 4, 9, 4.0, 190, 12000, 'Top', 10, 49942),
(4, 13, 9, 3, 2, 6, 1, 14, 1, 12, 26.0, 300, 21000, 'ADC', -50, 1823),
(4, 15, 6, 4, 7, 4, 19, 6, 5, 10, 3.2, 160, 13500, 'Jungle', 20, 13484),
(4, 17, 7, 3, 24, 6, 1, 4, 6, 15, 4.0, 140, 11500, 'Support', -15, 61271),
(4, 19, 4, 4, 9, 1, 5, 11, 3, 9, 7.0, 220, 16500, 'Mid', 20, 37684),
(4, 1, 5, 3, 4, 10, 4, 9, 4, 8, 3.5, 200, 15000, 'Top', -10, 14710),
(4, 2, 2, 4, 19, 2, 13, 13, 2, 11, 6.5, 240, 17500, 'ADC', 5 , 5426),
(4, 4, 3, 3, 14, 5, 6, 7, 3, 12, 4.0, 180, 12500, 'Jungle', -15, 121110),
(4, 6, 1, 4, 12, 8, 15, 5, 4, 14, 3.0, 160, 13000, 'Support', 20 , 5812),

-- Match 5
(5, 1, 1, 3, 7, 9, 3, 12, 2, 8, 10.0, 250, 15500, 'Mid', 35, 79386),
(5, 2, 3, 4, 13, 7, 15, 7, 4, 9, 4.0, 190, 12000, 'Top', -10, 31157),
(5, 3, 5, 3, 17, 10, 15, 14, 1, 12, 26.0, 300, 21000, 'ADC', 50, 89757),
(5, 4, 7, 4, 10, 10, 10, 6, 5, 10, 3.2, 160, 13500, 'Jungle', -20, 13834),
(5, 5, 9, 3, 3, 1, 1, 4, 6, 15, 4.0, 140, 11500, 'Support', 15, 5301),
(5, 20, 11, 4, 22, 3, 9, 11, 3, 9, 7.0, 220, 16500, 'Mid', -20, 52349),
(5, 19, 13, 3, 23, 8, 6, 9, 4, 8, 3.5, 200, 15000, 'Top', 10, 12802),
(5, 18, 15, 4, 26, 5, 5, 13, 2, 11, 6.5, 240, 17500, 'ADC', -5 , 68656),
(5, 17, 17, 3, 5, 5, 5, 7, 3, 12, 4.0, 180, 12500, 'Jungle', 15, 37555),
(5, 16, 19, 4, 10, 3, 4, 5, 4, 14, 3.0, 160, 13000, 'Support', -20 , 46513);

-- Insérer des maîtrises de champions
INSERT INTO champion_masteries (summoner_id, champion_id, mastery_level, mastery_points, number_of_games, kills, deaths, assists, kda, wins, losses, winrate, lp)
VALUES 
(1, 1, 7, 50000, 200, 1000, 500, 800, 3.6, 120, 80, 60, 150),
(2, 3, 6, 40000, 150, 800, 400, 600, 3.5, 90, 60, 60, 120),
(3, 4, 5, 30000, 100, 500, 300, 400, 3.0, 60, 40, 60, 100),
(4, 5, 6, 42000, 180, 850, 420, 630, 3.6, 110, 70, 61, 130),
(5, 6, 7, 55000, 220, 1050, 450, 750, 3.8, 130, 90, 59, 160),
(6, 7, 5, 38000, 140, 700, 350, 500, 3.3, 80, 60, 57, 110),
(7, 8, 6, 46000, 190, 900, 400, 650, 3.5, 100, 90, 53, 140),
(8, 9, 5, 35000, 120, 600, 300, 450, 3.0, 70, 50, 58, 90),
(9, 10, 6, 48000, 200, 950, 420, 700, 3.6, 120, 80, 60, 135),
(10, 11, 7, 60000, 250, 1100, 460, 800, 3.8, 140, 90, 61, 170),
(11, 12, 4, 28000, 90, 400, 250, 350, 2.8, 50, 40, 55, 85),
(12, 13, 6, 49000, 210, 1000, 420, 700, 3.6, 130, 80, 62, 145),
(13, 14, 5, 37000, 130, 650, 320, 480, 3.2, 75, 55, 56, 95),
(14, 15, 6, 50000, 200, 900, 400, 600, 3.5, 110, 70, 58, 125),
(15, 16, 7, 62000, 260, 1150, 470, 820, 3.9 ,150 ,100 ,62 ,175),
(16 ,17 ,4 ,29000 ,95 ,420 ,260 ,360 ,2.9 ,55 ,45 ,54 ,88),
(17 ,18 ,6 ,51000 ,205 ,980 ,430 ,710 ,3.7 ,135 ,85 ,63 ,150),
(18 ,19 ,5 ,36000 ,135 ,680 ,330 ,490 ,3.4 ,80 ,60 ,59 ,100),
(19 ,20 ,6 ,53000 ,215 ,1020 ,440 ,720 ,3.8 ,140 ,85 ,64 ,155);

-- Insérer des statistiques des joueurs
INSERT INTO stats (summoner_id, solo_ranked_division, solo_lp, flex_ranked_division, flex_lp, winrate, solo_wins, solo_losses, solo_remakes, flex_wins, flex_losses, flex_remakes, kills, deaths, assists, kda)
VALUES 
(1, 'Gold IV', 50, 'Silver I', 30, 55, 100, 80, 5, 50, 40, 2, 1000, 500, 800, 3.6),
(2, 'Platinum III', 75, 'Gold II', 60, 60, 120, 60, 3, 70, 50, 1, 800, 400, 600, 3.5),
(3, 'Diamond I', 100, 'Platinum IV', 90, 65, 150, 50, 2, 80, 40, 0, 500, 300, 400, 3.0),
(4, 'Gold II', 60, 'Silver II', 40, 58, 110, 90, 4, 60, 50, 3, 900, 450, 700, 3.4),
(5, 'Platinum II', 85, 'Gold I', 55, 62, 130, 70, 1, 75, 55, 0, 950, 400, 750, 3.6),
(6, 'Silver I', 30, 'Bronze II', 20, 50, 80, 80, 6, 40, 60, 2, 600, 500, 500, 2.8),
(7, 'Diamond IV', 90, 'Platinum III', 80, 67, 140, 60, 0, 85, 40, 1, 1100, 450, 750, 3.7),
(8, 'Gold III', 55, 'Silver IV', 35, 53, 90, 80, 4, 45, 55, 3, 750, 400, 600, 3.1),
(9, 'Platinum IV', 70, 'Gold III', 50, 60, 120, 60, 2, 60, 50, 0, 850, 500, 650, 3.3),
(10, 'Silver II', 40, 'Bronze I', 15, 45, 70, 90, 5, 30, 60, 4, 500, 400, 450, 2.5),
(11, 'Diamond III', 95, 'Platinum II', 70, 68, 160, 40, 0, 90, 50, 1, 1200, 400, 800, 3.8),
(12, 'Gold I', 65, 'Silver III', 45, 58, 110, 90, 3, 50, 60, 2, 950, 450, 700, 3.4),
(13, 'Platinum I', 80, 'Gold IV', 55, 63, 130, 70, 1, 75, 55, 0, 1000, 500, 750, 3.6),
(14, 'Silver III', 35, 'Bronze III', 25, 52, 85, 85, 7, 35, 65, 5, 550, 500, 550, 2.9),
(15, 'Diamond II', 88, 'Platinum I', 78, 66, 145, 55, 0 ,95 ,45 ,1 ,1150 ,450 ,800 ,3.9),
(16 , 'Gold III' ,60 ,'Silver IV' ,40 ,54 ,100 ,80 ,4 ,50 ,60 ,3 ,700 ,400 ,600 ,3.2),
(17 ,'Platinum II' ,85 ,'Gold I' ,55 ,62 ,130 ,70 ,1 ,75 ,55 ,0 ,950 ,400 ,750 ,3.6),
(18 ,'Silver I' ,30 ,'Bronze II' ,20 ,50 ,80 ,80 ,6 ,40 ,60 ,2 ,600 ,500 ,500 ,2.8),
(19 ,'Diamond IV' ,90 ,'Platinum III' ,80 ,'67' ,'140' ,'60' ,'0' ,'85' ,'40' ,'1' ,'1100' ,'450' ,'750' ,'3.7');



