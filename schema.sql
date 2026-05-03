-- ============================================================
-- Sports Broadcasting System — MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS sports_broadcasting;
USE sports_broadcasting;

-- Drop all tables to reset schema
DROP TABLE IF EXISTS ADMIN, SPONSOR_TOURNAMENT, PLAYER_TEAM, BROADCAST_SCHEDULE, MEDIA_RIGHTS, SPONSOR, COMMENTATOR, PRODUCTION_CREW, CHANNEL, BROADCASTER, CAMERA, MATCHES, STADIUM, PLAYER, TEAM, SEASON, TOURNAMENT, SPORT;

-- ============================================================
-- 1. SPORT
-- ============================================================
CREATE TABLE IF NOT EXISTS SPORT (
  sport_id       INT AUTO_INCREMENT PRIMARY KEY,
  sport_name     VARCHAR(100) NOT NULL,
  governing_body VARCHAR(150)
);

-- ============================================================
-- 2. TOURNAMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS TOURNAMENT (
  tournament_id    INT AUTO_INCREMENT PRIMARY KEY,
  tournament_name  VARCHAR(150) NOT NULL,
  host_country     VARCHAR(100),
  tournament_level VARCHAR(50) DEFAULT 'Franchise', -- 'International', 'National', 'Franchise'
  sport_id         INT,
  FOREIGN KEY (sport_id) REFERENCES SPORT(sport_id) ON DELETE SET NULL
);

-- ============================================================
-- 3. SEASON
-- ============================================================
CREATE TABLE IF NOT EXISTS SEASON (
  season_id     INT AUTO_INCREMENT PRIMARY KEY,
  season_year   YEAR         NOT NULL,
  start_date    DATE,
  end_date      DATE,
  tournament_id INT,
  FOREIGN KEY (tournament_id) REFERENCES TOURNAMENT(tournament_id) ON DELETE SET NULL
);

-- ============================================================
-- 4. TEAM
-- ============================================================
CREATE TABLE IF NOT EXISTS TEAM (
  team_id       INT AUTO_INCREMENT PRIMARY KEY,
  team_name     VARCHAR(100) NOT NULL,
  home_city     VARCHAR(100),
  coach_name    VARCHAR(100),
  sport_id      INT,
  team_level    VARCHAR(50) DEFAULT 'Franchise', -- 'International', 'National', 'Franchise'
  tournament_id INT, -- For Franchise teams to link to their primary league
  FOREIGN KEY (sport_id) REFERENCES SPORT(sport_id) ON DELETE SET NULL,
  FOREIGN KEY (tournament_id) REFERENCES TOURNAMENT(tournament_id) ON DELETE SET NULL
);

-- ============================================================
-- 5. PLAYER
-- ============================================================
CREATE TABLE IF NOT EXISTS PLAYER (
  player_id   INT AUTO_INCREMENT PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  role        VARCHAR(50),
  nationality VARCHAR(100),
  sport_id    INT,
  FOREIGN KEY (sport_id) REFERENCES SPORT(sport_id) ON DELETE SET NULL
);

-- ============================================================
-- 5.1 PLAYER_TEAM (Junction Table)
-- ============================================================
CREATE TABLE IF NOT EXISTS PLAYER_TEAM (
  player_id INT,
  team_id   INT,
  PRIMARY KEY (player_id, team_id),
  FOREIGN KEY (player_id) REFERENCES PLAYER(player_id) ON DELETE CASCADE,
  FOREIGN KEY (team_id)   REFERENCES TEAM(team_id)     ON DELETE CASCADE
);

-- ============================================================
-- 6. STADIUM
-- ============================================================
CREATE TABLE IF NOT EXISTS STADIUM (
  stadium_id   INT AUTO_INCREMENT PRIMARY KEY,
  stadium_name VARCHAR(150) NOT NULL,
  city         VARCHAR(100),
  capacity     INT,
  sport_id     INT,
  FOREIGN KEY (sport_id) REFERENCES SPORT(sport_id) ON DELETE SET NULL
);

-- ============================================================
-- 7. MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS MATCHES (
  match_id     INT AUTO_INCREMENT PRIMARY KEY,
  match_date   DATE,
  start_time   TIME,
  match_status VARCHAR(50) DEFAULT 'Scheduled',
  home_team_id INT,
  away_team_id INT,
  home_score   INT DEFAULT 0,
  away_score   INT DEFAULT 0,
  stream_url   VARCHAR(255),
  season_id    INT,
  stadium_id   INT,
  FOREIGN KEY (home_team_id) REFERENCES TEAM(team_id) ON DELETE SET NULL,
  FOREIGN KEY (away_team_id) REFERENCES TEAM(team_id) ON DELETE SET NULL,
  FOREIGN KEY (season_id)    REFERENCES SEASON(season_id)   ON DELETE SET NULL,
  FOREIGN KEY (stadium_id)   REFERENCES STADIUM(stadium_id) ON DELETE SET NULL
);

-- ============================================================
-- 8. CAMERA
-- ============================================================
CREATE TABLE IF NOT EXISTS CAMERA (
  camera_id   INT AUTO_INCREMENT PRIMARY KEY,
  camera_type VARCHAR(100),
  resolution  VARCHAR(50),
  stadium_id  INT,
  FOREIGN KEY (stadium_id) REFERENCES STADIUM(stadium_id) ON DELETE CASCADE
);

-- ============================================================
-- 9. BROADCASTER
-- ============================================================
CREATE TABLE IF NOT EXISTS BROADCASTER (
  broadcaster_id   INT AUTO_INCREMENT PRIMARY KEY,
  broadcaster_name VARCHAR(150) NOT NULL,
  country          VARCHAR(100),
  contact_email    VARCHAR(150),
  sport_id         INT,
  FOREIGN KEY (sport_id) REFERENCES SPORT(sport_id) ON DELETE SET NULL
);

-- ============================================================
-- 10. CHANNEL
-- ============================================================
CREATE TABLE IF NOT EXISTS CHANNEL (
  channel_id     INT AUTO_INCREMENT PRIMARY KEY,
  channel_name   VARCHAR(100) NOT NULL,
  language       VARCHAR(50),
  broadcaster_id INT,
  FOREIGN KEY (broadcaster_id) REFERENCES BROADCASTER(broadcaster_id) ON DELETE CASCADE
);

-- ============================================================
-- 11. PRODUCTION_CREW
-- ============================================================
CREATE TABLE IF NOT EXISTS PRODUCTION_CREW (
  crew_id        INT AUTO_INCREMENT PRIMARY KEY,
  crew_name      VARCHAR(100) NOT NULL,
  role           VARCHAR(100),
  broadcaster_id INT,
  FOREIGN KEY (broadcaster_id) REFERENCES BROADCASTER(broadcaster_id) ON DELETE CASCADE
);

-- ============================================================
-- 12. COMMENTATOR
-- ============================================================
CREATE TABLE IF NOT EXISTS COMMENTATOR (
  commentator_id   INT AUTO_INCREMENT PRIMARY KEY,
  commentator_name VARCHAR(100) NOT NULL,
  language         VARCHAR(50),
  broadcaster_id   INT,
  FOREIGN KEY (broadcaster_id) REFERENCES BROADCASTER(broadcaster_id) ON DELETE CASCADE
);

-- ============================================================
-- 13. SPONSOR
-- ============================================================
CREATE TABLE IF NOT EXISTS SPONSOR (
  sponsor_id    INT AUTO_INCREMENT PRIMARY KEY,
  sponsor_name  VARCHAR(150) NOT NULL,
  industry_type VARCHAR(100),
  sport_id      INT,
  FOREIGN KEY (sport_id) REFERENCES SPORT(sport_id) ON DELETE SET NULL
);

-- ============================================================
-- 14. MEDIA_RIGHTS
-- ============================================================
CREATE TABLE IF NOT EXISTS MEDIA_RIGHTS (
  rights_id      INT AUTO_INCREMENT PRIMARY KEY,
  rights_fee     DECIMAL(15,2),
  broadcaster_id INT,
  tournament_id  INT,
  FOREIGN KEY (broadcaster_id) REFERENCES BROADCASTER(broadcaster_id) ON DELETE CASCADE,
  FOREIGN KEY (tournament_id)  REFERENCES TOURNAMENT(tournament_id)   ON DELETE CASCADE
);

-- ============================================================
-- 15. BROADCAST_SCHEDULE
-- ============================================================
CREATE TABLE IF NOT EXISTS BROADCAST_SCHEDULE (
  schedule_id    INT AUTO_INCREMENT PRIMARY KEY,
  start_time     TIME,
  end_time       TIME,
  broadcaster_id INT,
  match_id       INT,
  FOREIGN KEY (broadcaster_id) REFERENCES BROADCASTER(broadcaster_id) ON DELETE CASCADE,
  FOREIGN KEY (match_id)       REFERENCES MATCHES(match_id)           ON DELETE CASCADE
);

-- ============================================================
-- 16. SPONSOR_TOURNAMENT (Junction Table)
-- ============================================================
CREATE TABLE IF NOT EXISTS SPONSOR_TOURNAMENT (
  sponsor_id    INT,
  tournament_id INT,
  PRIMARY KEY (sponsor_id, tournament_id),
  FOREIGN KEY (sponsor_id)    REFERENCES SPONSOR(sponsor_id)       ON DELETE CASCADE,
  FOREIGN KEY (tournament_id) REFERENCES TOURNAMENT(tournament_id) ON DELETE CASCADE
);

-- ============================================================
-- 17. ADMIN (for JWT authentication)
-- ============================================================
CREATE TABLE IF NOT EXISTS ADMIN (
  admin_id       INT AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(50)  NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL
);
