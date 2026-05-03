# Sports Broadcasting System

A full-stack web application built with **React, Tailwind CSS, Express.js, and MySQL**.

## Features Included
- **Complete MySQL Schema**: 16 tables covering players, teams, matches, stadiums, broadcasters, channels, sponsors, and media rights.
- **REST APIs**: Full CRUD operations for all entities.
- **Advanced SQL**: Includes JOINs, Transactions (Match + Schedule creation), and Concurrency Control (SELECT FOR UPDATE on match edits).
- **Authentication**: JWT-based admin login with protected routes.
- **Premium Frontend UI**: Dark mode glassmorphism UI with Recharts dashboard, Sidebar navigation, Modals, and responsive Data Tables.

## Setup Instructions

### 1. Database Setup
Since you already have MySQL running, execute the SQL files in your MySQL client:
```bash
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```
*(The seed script provides default data and an admin user.)*

### 2. Backend Setup
1. Open a terminal in the `server` directory.
2. Update the `.env` file with your MySQL credentials if they differ from the defaults.
3. Install dependencies and start the server:
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
1. Open a new terminal in the `client` directory.
2. Install dependencies and start the dev server:
```bash
cd client
npm install
npm run dev
```

### 4. Access the Application
- Open your browser to `http://localhost:5173`
- **Default Admin Login**:
  - Username: `admin`
  - Password: `admin123`

## Testing Advanced Features
- **JOIN Queries**: The Dashboard, Players, and Matches pages all fetch and display joined data automatically.
- **Transactions**: Go to the "Matches" page and create a new match. If you assign a "Broadcaster" during creation, the backend will use a MySQL Transaction to insert both the `MATCHES` record and the `BROADCAST_SCHEDULE` record atomically.
- **Concurrency Control**: Edit a match on the "Matches" page. The backend uses `SELECT ... FOR UPDATE` to lock the row during the update.
