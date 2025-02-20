CREATE TABLE summoners (
    summoner_id SERIAL PRIMARY KEY,
    summoner_name VARCHAR(255) UNIQUE NOT NULL,
    puuid VARCHAR(255) UNIQUE NOT NULL,
    region VARCHAR(255) NOT NULL,
    profile_icon_id VARCHAR(255) NOT NULL,
    summoner_level INT NOT NULL,
    ranked_division VARCHAR(50) NOT NULL,
    lp INT NOT NULL
);

CREATE TABLE champion (
    champion_id SERIAL PRIMARY KEY,
    champion_name VARCHAR(256) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL,
    lore TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    champion_image VARCHAR(255) NOT NULL
);

CREATE TABLE matches (
    match_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    summoner_id INT NOT NULL,
    champion_id INT NOT NULL,
    kills INT NOT NULL,
    deaths INT NOT NULL,
    assists INT NOT NULL,
    match_duration INT NOT NULL,
    match_result VARCHAR(10) NOT NULL CHECK (match_result IN ('Win', 'Loss')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (champion_id) REFERENCES champion(champion_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE match_participant (
    match_participant_id SERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL,
    summoner_id INT NOT NULL,
    champion_id INT NOT NULL,
    role VARCHAR(255) NOT NULL,
    kills INT NOT NULL DEFAULT 0,
    deaths INT NOT NULL DEFAULT 0,
    assists INT NOT NULL DEFAULT 0,
    gold_earned INT NOT NULL DEFAULT 0,
    damage_dealt INT NOT NULL DEFAULT 0,
    rank VARCHAR(50) NOT NULL,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (champion_id) REFERENCES champion(champion_id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE (match_id, summoner_id)
);

CREATE TABLE champion_mastery (
    champion_mastery_id SERIAL PRIMARY KEY,
    summoner_id INT NOT NULL,
    champion_id INT NOT NULL,
    mastery_level INT NOT NULL,
    mastery_points INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (champion_id) REFERENCES champion(champion_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE stats (
    stat_id SERIAL PRIMARY KEY,
    summoner_id INT NOT NULL,
    region VARCHAR(255) NOT NULL,
    solo_rank VARCHAR(50) NOT NULL,
    flex_rank VARCHAR(50) NOT NULL,
    solo_wins INT NOT NULL,
    solo_losses INT NOT NULL,
    flex_wins INT NOT NULL,
    flex_losses INT NOT NULL,
    kills INT DEFAULT 0,
    deaths INT DEFAULT 0,
    assists INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (summoner_id) REFERENCES summoners(summoner_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE rune (
    rune_id SERIAL PRIMARY KEY,
    rune_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE spell (
    spell_id SERIAL PRIMARY KEY,
    spell_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    spell_picture VARCHAR(255) NOT NULL,
    champion_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (champion_id) REFERENCES champion(champion_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE match_participant_items (
    participant_id INT NOT NULL,
    item_id INT NOT NULL,
    PRIMARY KEY (participant_id, item_id),
    FOREIGN KEY (participant_id) REFERENCES match_participant(match_participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE match_participant_runes (
    participant_id INT NOT NULL,
    rune_id INT NOT NULL,
    PRIMARY KEY (participant_id, rune_id),
    FOREIGN KEY (participant_id) REFERENCES match_participant(match_participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (rune_id) REFERENCES rune(rune_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE match_participant_spells (
    participant_id INT NOT NULL,
    spell_id INT NOT NULL,
    PRIMARY KEY (participant_id, spell_id),
    FOREIGN KEY (participant_id) REFERENCES match_participant(match_participant_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (spell_id) REFERENCES spell(spell_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Ajout d'index pour améliorer la rapidité des requêtes
CREATE INDEX idx_summoners_puuid ON summoners(puuid);
CREATE INDEX idx_matches_summoner_id ON matches(summoner_id);
CREATE INDEX idx_matches_champion_id ON matches(champion_id);
CREATE INDEX idx_match_participant_match_id ON match_participant(match_id);
CREATE INDEX idx_match_participant_summoner_id ON match_participant(summoner_id);
CREATE INDEX idx_match_participant_champion_id ON match_participant(champion_id);
