import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Teams from './pages/Teams';
import Matches from './pages/Matches';
import Stadiums from './pages/Stadiums';
import Broadcasters from './pages/Broadcasters';
import Sponsors from './pages/Sponsors';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Admin Login</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input type="text" className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition-opacity">Login</button>
        </form>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/players" element={<ProtectedRoute><Players /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/stadiums" element={<ProtectedRoute><Stadiums /></ProtectedRoute>} />
        <Route path="/broadcasters" element={<ProtectedRoute><Broadcasters /></ProtectedRoute>} />
        <Route path="/sponsors" element={<ProtectedRoute><Sponsors /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
