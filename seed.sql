-- Sports Broadcasting Seed Data (Massive Dataset)
USE sports_broadcasting;

-- Admin User
INSERT IGNORE INTO ADMIN (username, password_hash) VALUES ('admin', '$2a$10$zsbk/dz1IPsHk3qmhAJLIuUSFpFzeIe/nHieELFZs9U.qoX.6vNyK');

-- ==========================================
-- 1. SPORTS
-- ==========================================
INSERT IGNORE INTO SPORT (sport_id, sport_name, governing_body) VALUES 
(1, 'Cricket', 'ICC'), 
(2, 'Football', 'FIFA'), 
(3, 'Basketball', 'FIBA'),
(4, 'Baseball', 'WBSC');

-- ==========================================
-- 2. TOURNAMENTS
-- ==========================================
INSERT IGNORE INTO TOURNAMENT (tournament_id, tournament_name, host_country, tournament_level, sport_id) VALUES 
-- Cricket
(1, 'ICC World Cup', 'India', 'International', 1),
(2, 'ICC T20 World Cup', 'USA/WI', 'International', 1),
(3, 'Ranji Trophy', 'India', 'National', 1),
(4, 'Indian Premier League (IPL)', 'India', 'Franchise', 1),
(5, 'Big Bash League (BBL)', 'Australia', 'Franchise', 1),
-- Football
(6, 'FIFA World Cup', 'Qatar', 'International', 2),
(7, 'UEFA Euro', 'Germany', 'International', 2),
(8, 'English Premier League', 'UK', 'Franchise', 2),
(9, 'La Liga', 'Spain', 'Franchise', 2),
(10, 'Serie A', 'Italy', 'Franchise', 2),
-- Basketball
(11, 'FIBA World Cup', 'Philippines', 'International', 3),
(12, 'NBA', 'USA', 'Franchise', 3),
(13, 'EuroLeague', 'Europe', 'Franchise', 3),
-- Baseball
(14, 'World Baseball Classic', 'USA', 'International', 4),
(15, 'Major League Baseball (MLB)', 'USA', 'Franchise', 4);

-- ==========================================
-- 3. SEASONS
-- ==========================================
INSERT IGNORE INTO SEASON (season_id, season_year, start_date, end_date, tournament_id) VALUES 
(1, 2024, '2024-03-22', '2024-05-26', 4), -- IPL
(2, 2024, '2024-08-16', '2025-05-25', 8), -- EPL
(3, 2024, '2024-08-15', '2025-05-25', 9), -- La Liga
(4, 2024, '2024-10-24', '2025-04-14', 12), -- NBA
(5, 2024, '2024-03-28', '2024-09-29', 15); -- MLB

-- ==========================================
-- 4. TEAMS
-- ==========================================
INSERT IGNORE INTO TEAM (team_id, team_name, home_city, coach_name, sport_id, team_level, tournament_id) VALUES 
-- Cricket International
(1, 'India', 'New Delhi', 'Gautam Gambhir', 1, 'International', NULL),
(2, 'Australia', 'Sydney', 'Andrew McDonald', 1, 'International', NULL),
(3, 'England', 'London', 'Matthew Mott', 1, 'International', NULL),
-- Cricket Franchise (IPL)
(4, 'Mumbai Indians', 'Mumbai', 'Mark Boucher', 1, 'Franchise', 4),
(5, 'Chennai Super Kings', 'Chennai', 'Stephen Fleming', 1, 'Franchise', 4),
(6, 'Royal Challengers Bengaluru', 'Bengaluru', 'Andy Flower', 1, 'Franchise', 4),
-- Football International
(7, 'Argentina', 'Buenos Aires', 'Lionel Scaloni', 2, 'International', NULL),
(8, 'France', 'Paris', 'Didier Deschamps', 2, 'International', NULL),
(9, 'Brazil', 'Rio de Janeiro', 'Dorival Junior', 2, 'International', NULL),
-- Football Franchise (EPL/La Liga)
(10, 'Real Madrid', 'Madrid', 'Carlo Ancelotti', 2, 'Franchise', 9),
(11, 'FC Barcelona', 'Barcelona', 'Hansi Flick', 2, 'Franchise', 9),
(12, 'Manchester City', 'Manchester', 'Pep Guardiola', 2, 'Franchise', 8),
(13, 'Arsenal', 'London', 'Mikel Arteta', 2, 'Franchise', 8),
-- Basketball International
(14, 'USA Basketball', 'Colorado Springs', 'Steve Kerr', 3, 'International', NULL),
(15, 'Spain', 'Madrid', 'Sergio Scariolo', 3, 'International', NULL),
-- Basketball Franchise (NBA)
(16, 'Los Angeles Lakers', 'Los Angeles', 'Darvin Ham', 3, 'Franchise', 12),
(17, 'Golden State Warriors', 'San Francisco', 'Steve Kerr', 3, 'Franchise', 12),
(18, 'Boston Celtics', 'Boston', 'Joe Mazzulla', 3, 'Franchise', 12),
-- Baseball Franchise (MLB)
(19, 'New York Yankees', 'New York', 'Aaron Boone', 4, 'Franchise', 15),
(20, 'Los Angeles Dodgers', 'Los Angeles', 'Dave Roberts', 4, 'Franchise', 15);

-- ==========================================
-- 5. PLAYERS
-- ==========================================
INSERT IGNORE INTO PLAYER (player_id, player_name, role, nationality, sport_id) VALUES 
-- Cricket
(1, 'Rohit Sharma', 'Batsman', 'Indian', 1),
(2, 'Jasprit Bumrah', 'Bowler', 'Indian', 1),
(3, 'MS Dhoni', 'Wicketkeeper', 'Indian', 1),
(4, 'Ravindra Jadeja', 'All-rounder', 'Indian', 1),
(5, 'Virat Kohli', 'Batsman', 'Indian', 1),
(6, 'Glenn Maxwell', 'All-rounder', 'Australian', 1),
(7, 'Pat Cummins', 'Bowler', 'Australian', 1),
(8, 'Mitchell Starc', 'Bowler', 'Australian', 1),
-- Football
(9, 'Jude Bellingham', 'Midfielder', 'English', 2),
(10, 'Vinicius Jr', 'Forward', 'Brazilian', 2),
(11, 'Robert Lewandowski', 'Forward', 'Polish', 2),
(12, 'Pedri', 'Midfielder', 'Spanish', 2),
(13, 'Erling Haaland', 'Forward', 'Norwegian', 2),
(14, 'Kevin De Bruyne', 'Midfielder', 'Belgian', 2),
(15, 'Bukayo Saka', 'Forward', 'English', 2),
(16, 'Lionel Messi', 'Forward', 'Argentine', 2),
(17, 'Kylian Mbappe', 'Forward', 'French', 2),
-- Basketball
(18, 'LeBron James', 'Forward', 'American', 3),
(19, 'Anthony Davis', 'Center', 'American', 3),
(20, 'Stephen Curry', 'Guard', 'American', 3),
(21, 'Klay Thompson', 'Guard', 'American', 3),
(22, 'Jayson Tatum', 'Forward', 'American', 3),
(23, 'Jaylen Brown', 'Guard', 'American', 3),
-- Baseball
(24, 'Aaron Judge', 'Outfielder', 'American', 4),
(25, 'Gerrit Cole', 'Pitcher', 'American', 4),
(26, 'Shohei Ohtani', 'Designated Hitter', 'Japanese', 4),
(27, 'Mookie Betts', 'Outfielder', 'American', 4);

-- ==========================================
-- 6. STADIUMS
-- ==========================================
INSERT IGNORE INTO STADIUM (stadium_id, stadium_name, city, capacity, sport_id) VALUES 
(1, 'Wankhede Stadium', 'Mumbai', 33108, 1),
(2, 'M. A. Chidambaram Stadium', 'Chennai', 38200, 1),
(3, 'M. Chinnaswamy Stadium', 'Bengaluru', 40000, 1),
(4, 'MCG', 'Melbourne', 100024, 1),
(5, 'Santiago Bernabeu', 'Madrid', 81044, 2),
(6, 'Camp Nou', 'Barcelona', 99354, 2),
(7, 'Etihad Stadium', 'Manchester', 53400, 2),
(8, 'Emirates Stadium', 'London', 60704, 2),
(9, 'Crypto.com Arena', 'Los Angeles', 19060, 3),
(10, 'Chase Center', 'San Francisco', 18064, 3),
(11, 'TD Garden', 'Boston', 19156, 3),
(12, 'Yankee Stadium', 'New York', 46537, 4),
(13, 'Dodger Stadium', 'Los Angeles', 56000, 4);

-- ==========================================
-- 7. MATCHES
-- ==========================================
INSERT IGNORE INTO MATCHES (match_id, match_date, start_time, match_status, season_id, stadium_id) VALUES 
(1, '2024-04-10', '19:30:00', 'Completed', 1, 1), -- IPL MI vs CSK
(2, '2024-04-15', '19:30:00', 'Scheduled', 1, 3), -- IPL RCB vs MI
(3, '2024-10-25', '21:00:00', 'Scheduled', 3, 5), -- La Liga El Clasico
(4, '2024-11-05', '17:30:00', 'Scheduled', 2, 7), -- EPL Man City vs Arsenal
(5, '2024-12-25', '20:00:00', 'Scheduled', 4, 9), -- NBA Lakers vs Warriors
(6, '2024-06-15', '19:00:00', 'Completed', 5, 12); -- MLB Yankees vs Dodgers

-- ==========================================
-- 8. BROADCASTERS
-- ==========================================
INSERT IGNORE INTO BROADCASTER (broadcaster_id, broadcaster_name, country, contact_email, sport_id) VALUES 
(1, 'Star Sports', 'India', 'contact@starsports.com', 1),
(2, 'JioCinema', 'India', 'support@jiocinema.com', 1),
(3, 'Sky Sports', 'UK', 'support@skysports.com', 2),
(4, 'ESPN', 'USA', 'contact@espn.com', 3),
(5, 'TNT Sports', 'USA', 'info@tntsports.com', 3),
(6, 'Fox Sports', 'USA', 'support@foxsports.com', 4),
(7, 'DAZN', 'Global', 'contact@dazn.com', 2),
(8, 'Sony Sports Network', 'India', 'info@sonysports.com', 1),
(9, 'BeIN Sports', 'Qatar', 'support@beinsports.com', 2),
(10, 'Amazon Prime Video', 'Global', 'sports@amazon.com', 2);

-- ==========================================
-- 9. SPONSORS
-- ==========================================
INSERT IGNORE INTO SPONSOR (sponsor_id, sponsor_name, industry_type, sport_id) VALUES 
(1, 'Dream11', 'Gaming', 1),
(2, 'Tata', 'Automobile', 1),
(3, 'Emirates', 'Airlines', 2),
(4, 'Spotify', 'Music Streaming', 2),
(5, 'Nike', 'Apparel', 3),
(6, 'State Farm', 'Insurance', 3),
(7, 'Rolex', 'Luxury', 1),
(8, 'Coca-Cola', 'Beverages', 2),
(9, 'Mastercard', 'Finance', 4),
(10, 'T-Mobile', 'Telecom', 4);

-- ==========================================
-- 10. MEDIA RIGHTS
-- ==========================================
INSERT IGNORE INTO MEDIA_RIGHTS (rights_fee, broadcaster_id, tournament_id) VALUES 
(6000000000.00, 1, 4), -- Star Sports IPL
(3000000000.00, 3, 8), -- Sky Sports EPL
(2500000000.00, 4, 12); -- ESPN NBA

-- ==========================================
-- 11. MASSIVE DATA EXPANSION (WEB SEARCHED)
-- ==========================================

-- MORE TEAMS (IDs 21 to 43)
INSERT IGNORE INTO TEAM (team_id, team_name, home_city, coach_name, sport_id, team_level, tournament_id) VALUES 
(21, 'Pakistan', 'Lahore', 'Gary Kirsten', 1, 'International', NULL),
(22, 'South Africa', 'Cape Town', 'Rob Walter', 1, 'International', NULL),
(23, 'New Zealand', 'Auckland', 'Gary Stead', 1, 'International', NULL),
(24, 'Kolkata Knight Riders', 'Kolkata', 'Chandrakant Pandit', 1, 'Franchise', 4),
(25, 'Sunrisers Hyderabad', 'Hyderabad', 'Daniel Vettori', 1, 'Franchise', 4),
(26, 'Rajasthan Royals', 'Jaipur', 'Kumar Sangakkara', 1, 'Franchise', 4),
(27, 'Delhi Capitals', 'New Delhi', 'Ricky Ponting', 1, 'Franchise', 4),
(28, 'Liverpool', 'Liverpool', 'Jurgen Klopp', 2, 'Franchise', 8),
(29, 'Chelsea', 'London', 'Mauricio Pochettino', 2, 'Franchise', 8),
(30, 'Paris Saint-Germain', 'Paris', 'Luis Enrique', 2, 'Franchise', NULL),
(31, 'Juventus', 'Turin', 'Massimiliano Allegri', 2, 'Franchise', 10),
(32, 'Inter Milan', 'Milan', 'Simone Inzaghi', 2, 'Franchise', 10),
(33, 'Germany', 'Berlin', 'Julian Nagelsmann', 2, 'International', NULL),
(34, 'Spain', 'Madrid', 'Luis de la Fuente', 2, 'International', NULL),
(35, 'Italy', 'Rome', 'Luciano Spalletti', 2, 'International', NULL),
(36, 'Chicago Bulls', 'Chicago', 'Billy Donovan', 3, 'Franchise', 12),
(37, 'New York Knicks', 'New York', 'Tom Thibodeau', 3, 'Franchise', 12),
(38, 'Dallas Mavericks', 'Dallas', 'Jason Kidd', 3, 'Franchise', 12),
(39, 'Denver Nuggets', 'Denver', 'Michael Malone', 3, 'Franchise', 12),
(40, 'Houston Astros', 'Houston', 'Joe Espada', 4, 'Franchise', 15),
(41, 'Texas Rangers', 'Arlington', 'Bruce Bochy', 4, 'Franchise', 15),
(42, 'Atlanta Braves', 'Atlanta', 'Brian Snitker', 4, 'Franchise', 15),
(43, 'Philadelphia Phillies', 'Philadelphia', 'Rob Thomson', 4, 'Franchise', 15),
(44, 'Punjab Kings', 'Mohali', 'Trevor Bayliss', 1, 'Franchise', 4);

-- MORE PLAYERS (IDs 28 to 58)
INSERT IGNORE INTO PLAYER (player_id, player_name, role, nationality, sport_id) VALUES 
(28, 'Babar Azam', 'Batsman', 'Pakistani', 1),
(29, 'Shaheen Afridi', 'Bowler', 'Pakistani', 1),
(30, 'Kane Williamson', 'Batsman', 'New Zealander', 1),
(31, 'Trent Boult', 'Bowler', 'New Zealander', 1),
(32, 'Quinton de Kock', 'Wicketkeeper', 'South African', 1),
(33, 'Kagiso Rabada', 'Bowler', 'South African', 1),
(34, 'Shreyas Iyer', 'Batsman', 'Indian', 1),
(35, 'Shubman Gill', 'Batsman', 'Indian', 1),
(36, 'Rishabh Pant', 'Wicketkeeper', 'Indian', 1),
(37, 'Mohamed Salah', 'Forward', 'Egyptian', 2),
(38, 'Virgil van Dijk', 'Defender', 'Dutch', 2),
(39, 'Harry Kane', 'Forward', 'English', 2),
(40, 'Antoine Griezmann', 'Forward', 'French', 2),
(41, 'Neymar Jr', 'Forward', 'Brazilian', 2),
(42, 'Son Heung-min', 'Forward', 'South Korean', 2),
(43, 'Luka Modric', 'Midfielder', 'Croatian', 2),
(44, 'Nikola Jokic', 'Center', 'Serbian', 3),
(45, 'Giannis Antetokounmpo', 'Forward', 'Greek', 3),
(46, 'Luka Doncic', 'Guard', 'Slovenian', 3),
(47, 'Devin Booker', 'Guard', 'American', 3),
(48, 'Jalen Brunson', 'Guard', 'American', 3),
(49, 'Kevin Durant', 'Forward', 'American', 3),
(50, 'Joel Embiid', 'Center', 'American', 3),
(51, 'Bryce Harper', 'First Baseman', 'American', 4),
(52, 'Corey Seager', 'Shortstop', 'American', 4),
(53, 'Ronald Acuna Jr', 'Outfielder', 'Venezuelan', 4),
(54, 'Freddie Freeman', 'First Baseman', 'American', 4),
(55, 'Juan Soto', 'Outfielder', 'Dominican', 4),
(56, 'Mike Trout', 'Outfielder', 'American', 4),
(57, 'Yashasvi Jaiswal', 'Batsman', 'Indian', 1),
(58, 'Arshdeep Singh', 'Bowler', 'Indian', 1);

-- MORE STADIUMS (IDs 14 to 28)
INSERT IGNORE INTO STADIUM (stadium_id, stadium_name, city, capacity, sport_id) VALUES 
(14, 'Lords Cricket Ground', 'London', 30000, 1),
(15, 'Sydney Cricket Ground', 'Sydney', 48000, 1),
(16, 'The Oval', 'London', 27500, 1),
(17, 'Narendra Modi Stadium', 'Ahmedabad', 132000, 1),
(18, 'Anfield', 'Liverpool', 61276, 2),
(19, 'Parc des Princes', 'Paris', 47929, 2),
(20, 'Allianz Arena', 'Munich', 75000, 2),
(21, 'San Siro', 'Milan', 80018, 2),
(22, 'Wembley Stadium', 'London', 90000, 2),
(23, 'United Center', 'Chicago', 20917, 3),
(24, 'Madison Square Garden', 'New York', 19500, 3),
(25, 'American Airlines Center', 'Dallas', 19200, 3),
(26, 'Minute Maid Park', 'Houston', 41168, 4),
(27, 'Truist Park', 'Atlanta', 41084, 4),
(28, 'Citizens Bank Park', 'Philadelphia', 42901, 4);

-- MORE SPONSORS (IDs 11 to 23)
INSERT IGNORE INTO SPONSOR (sponsor_id, sponsor_name, industry_type, sport_id) VALUES 
(11, 'Samsung', 'Electronics', 1),
(12, 'Toyota', 'Automobile', 2),
(13, 'Red Bull', 'Energy Drink', 2),
(14, 'Visa', 'Finance', 3),
(15, 'Pepsi', 'Beverages', 4),
(16, 'Geico', 'Insurance', 4),
(17, 'Under Armour', 'Apparel', 3),
(18, 'Gatorade', 'Beverages', 3),
(19, 'Qatar Airways', 'Airlines', 2),
(20, 'Aramco', 'Energy', 1),
(21, 'MRF', 'Tyres', 1),
(22, 'BKT', 'Tyres', 1),
(23, 'Castrol', 'Automotive', 2);

-- MORE BROADCASTERS (IDs 11 to 17)
INSERT IGNORE INTO BROADCASTER (broadcaster_id, broadcaster_name, country, contact_email, sport_id) VALUES 
(11, 'SuperSport', 'South Africa', 'contact@supersport.com', 1),
(12, 'Willow TV', 'USA', 'support@willow.tv', 1),
(13, 'CBS Sports', 'USA', 'info@cbssports.com', 2),
(14, 'NBC Sports', 'USA', 'contact@nbcsports.com', 2),
(15, 'Optus Sport', 'Australia', 'support@optussport.com', 2),
(16, 'Bally Sports', 'USA', 'info@ballysports.com', 4),
(17, 'TBS', 'USA', 'contact@tbs.com', 4);

-- ==========================================
-- 12. PLAYER_TEAM JUNCTION
-- ==========================================
INSERT IGNORE INTO PLAYER_TEAM (player_id, team_id) VALUES 
-- Rohit Sharma (India, MI)
(1, 1), (1, 4),
-- Jasprit Bumrah (India, MI)
(2, 1), (2, 4),
-- MS Dhoni (CSK)
(3, 5),
-- Ravindra Jadeja (India, CSK)
(4, 1), (4, 5),
-- Virat Kohli (India, RCB)
(5, 1), (5, 6),
-- Glenn Maxwell (Australia, RCB)
(6, 2), (6, 6),
-- Pat Cummins (Australia)
(7, 2),
-- Mitchell Starc (Australia)
(8, 2),
-- Jude Bellingham (England, Real Madrid)
(9, 6), (9, 10),
-- Vinicius Jr (Brazil, Real Madrid)
(10, 9), (10, 10),
-- Robert Lewandowski (Barcelona)
(11, 11),
-- Pedri (Spain, Barcelona)
(12, 34), (12, 11),
-- Erling Haaland (Man City)
(13, 12),
-- Kevin De Bruyne (Man City)
(14, 12),
-- Bukayo Saka (England, Arsenal)
(15, 6), (15, 13),
-- Lionel Messi (Argentina)
(16, 7),
-- Kylian Mbappe (France)
(17, 8),
-- LeBron James (USA, Lakers)
(18, 14), (18, 16),
-- Anthony Davis (USA, Lakers)
(19, 14), (19, 16),
-- Stephen Curry (USA, Warriors)
(20, 14), (20, 17),
-- Klay Thompson (Warriors)
(21, 17),
-- Jayson Tatum (USA, Celtics)
(22, 14), (22, 18),
-- Jaylen Brown (Celtics)
(23, 18),
-- Aaron Judge (Yankees)
(24, 19),
-- Gerrit Cole (Yankees)
(25, 19),
-- Shohei Ohtani (Dodgers)
(26, 20),
-- Mookie Betts (Dodgers)
(27, 20),
-- Babar Azam (Pakistan)
(28, 21),
-- Shaheen Afridi (Pakistan)
(29, 21),
-- Kane Williamson (New Zealand)
(30, 23),
-- Trent Boult (New Zealand)
(31, 23),
-- Quinton de Kock (South Africa)
(32, 22),
-- Kagiso Rabada (South Africa)
(33, 22),
-- Shreyas Iyer (India, KKR)
(34, 1), (34, 24),
-- Shubman Gill (India)
(35, 1),
-- Rishabh Pant (India, DC)
(36, 1), (36, 27),
-- Mohamed Salah (Liverpool)
(37, 28),
-- Virgil van Dijk (Liverpool)
(38, 28),
-- Harry Kane (England)
(39, 6),
-- Antoine Griezmann (France)
(40, 8),
-- Neymar Jr (Brazil)
(41, 9),
-- Son Heung-min 
-- Luka Modric (Real Madrid)
(43, 10),
-- Nikola Jokic (Nuggets)
(44, 39),
-- Giannis Antetokounmpo
-- Luka Doncic (Mavs)
(46, 38),
-- Devin Booker
-- Jalen Brunson (Knicks)
(48, 37),
-- Kevin Durant (USA)
(49, 14),
-- Joel Embiid (USA)
(50, 14),
-- Bryce Harper (Phillies)
(51, 43),
-- Corey Seager (Rangers)
(52, 41),
-- Ronald Acuna Jr (Braves)
(53, 42),
-- Freddie Freeman (Dodgers)
(54, 20),
-- Juan Soto (Yankees)
(55, 19),
-- Mike Trout 
-- Yashasvi Jaiswal (India, RR)
(57, 1), (57, 26),
-- Arshdeep Singh (India, Punjab Kings)
(58, 1), (58, 44);

