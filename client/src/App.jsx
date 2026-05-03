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

const AuthPage = () => {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await signup(username, email, password);
      } else {
        await login(username, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || (isSignup ? 'Signup failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 border border-white/10">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            SportsCast
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sports Broadcasting Management</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => { if (isSignup) switchMode(); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              !isSignup ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { if (!isSignup) switchMode(); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              isSignup ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Username</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Email</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Password</label>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
              placeholder={isSignup ? 'Min 6 characters' : 'Enter password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Confirm Password</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-4 py-3 font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                {isSignup ? 'Creating Account...' : 'Logging in...'}
              </span>
            ) : (
              isSignup ? 'Create Account' : 'Login'
            )}
          </button>
        </form>

        {!isSignup && (
          <p className="text-center text-gray-500 text-xs mt-4">
            Admin: <span className="text-gray-400">admin / admin123</span>
          </p>
        )}
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
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
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
