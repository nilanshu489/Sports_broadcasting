-- Sports Broadcasting Seed Data

USE sports_broadcasting;

-- Admin User (password is 'admin123' hashed with bcrypt)
INSERT IGNORE INTO ADMIN (username, password_hash) VALUES ('admin', '$2a$10$zsbk/dz1IPsHk3qmhAJLIuUSFpFzeIe/nHieELFZs9U.qoX.6vNyK');

-- Sports
INSERT IGNORE INTO SPORT (sport_name, governing_body) VALUES 
('Cricket', 'ICC'), ('Football', 'FIFA'), ('Basketball', 'FIBA');

-- Tournaments
INSERT IGNORE INTO TOURNAMENT (tournament_name, host_country, sport_id) VALUES 
('World Cup 2024', 'India', 1),
('Champions League', 'Europe', 2);

-- Seasons
INSERT IGNORE INTO SEASON (season_year, start_date, end_date, tournament_id) VALUES 
(2024, '2024-06-01', '2024-07-15', 1),
(2024, '2024-08-15', '2025-05-30', 2);

-- Teams
INSERT IGNORE INTO TEAM (team_name, home_city, coach_name) VALUES 
('Mumbai Indians', 'Mumbai', 'Mark Boucher'),
('Real Madrid', 'Madrid', 'Carlo Ancelotti');

-- Players
INSERT IGNORE INTO PLAYER (player_name, role, nationality, team_id) VALUES 
('Rohit Sharma', 'Batsman', 'Indian', 1),
('Jude Bellingham', 'Midfielder', 'English', 2);

-- Stadiums
INSERT IGNORE INTO STADIUM (stadium_name, city, capacity) VALUES 
('Wankhede Stadium', 'Mumbai', 33108),
('Santiago Bernabeu', 'Madrid', 81044);

-- Matches
INSERT IGNORE INTO MATCHES (match_date, start_time, match_status, season_id, stadium_id) VALUES 
('2024-06-10', '19:30:00', 'Scheduled', 1, 1),
('2024-09-15', '21:00:00', 'Scheduled', 2, 2);

-- Broadcasters
INSERT IGNORE INTO BROADCASTER (broadcaster_name, country, contact_email) VALUES 
('Star Sports', 'India', 'contact@starsports.com'),
('Sky Sports', 'UK', 'support@skysports.com');

-- Channels
INSERT IGNORE INTO CHANNEL (channel_name, language, broadcaster_id) VALUES 
('Star Sports 1 HD', 'English', 1),
('Star Sports Hindi', 'Hindi', 1),
('Sky Main Event', 'English', 2);

-- Sponsors
INSERT IGNORE INTO SPONSOR (sponsor_name, industry_type) VALUES 
('Dream11', 'Gaming'),
('Emirates', 'Airlines');

-- Sponsor-Tournament
INSERT IGNORE INTO SPONSOR_TOURNAMENT (sponsor_id, tournament_id) VALUES 
(1, 1), (2, 2);

-- Media Rights
INSERT IGNORE INTO MEDIA_RIGHTS (rights_fee, broadcaster_id, tournament_id) VALUES 
(500000000, 1, 1),
(1200000000, 2, 2);

-- Schedule
INSERT IGNORE INTO BROADCAST_SCHEDULE (start_time, end_time, broadcaster_id, match_id) VALUES 
('19:00:00', '23:30:00', 1, 1);
