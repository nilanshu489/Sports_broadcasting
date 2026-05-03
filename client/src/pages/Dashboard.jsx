import React, { useState, useEffect } from 'react';
import { Users, Shield, Trophy, Video, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/dashboard/search?q=${searchTerm}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  if (!stats) return (
    <div className="p-10 text-center glass rounded-2xl border-red-500/20">
      <h2 className="text-xl text-red-400 font-bold mb-2">Database Connection Failed</h2>
      <p className="text-gray-400">Could not load dashboard statistics. Are you running without a database?</p>
    </div>
  );

  const statCards = [
    { title: 'Total Players', value: stats.total_players, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Total Teams', value: stats.total_teams, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Total Matches', value: stats.total_matches, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { title: 'Broadcasters', value: stats.total_broadcasters, icon: Video, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <div className="relative w-full sm:w-80 z-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search anything (Players, Teams...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-lg shadow-xl overflow-hidden">
              {isSearching ? (
                <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
              ) : searchResults.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {searchResults.map((result, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => navigate(`/${result.type}s`)}
                        className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex justify-between items-center transition-colors"
                      >
                        <span className="font-medium text-white">{result.name}</span>
                        <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300 capitalize">{result.type}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm">No results found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="glass rounded-2xl p-6 flex items-center space-x-4 hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-4 rounded-xl ${card.bg}`}>
              <card.icon className={`h-8 w-8 ${card.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Matches per Sport</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.matchesPerSport}>
                <XAxis dataKey="sport_name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} />
                <Bar dataKey="match_count" radius={[4, 4, 0, 0]}>
                  {stats.matchesPerSport.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Matches</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Tournament</th>
                  <th className="py-3 px-4 font-medium">Stadium</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMatches.map((match) => (
                  <tr key={match.match_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm">{new Date(match.match_date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">{match.tournament_name || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm">{match.stadium_name || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        match.match_status === 'Scheduled' ? 'bg-amber-400/20 text-amber-400' :
                        match.match_status === 'Live' ? 'bg-emerald-400/20 text-emerald-400' :
                        'bg-gray-400/20 text-gray-400'
                      }`}>
                        {match.match_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recentMatches.length === 0 && (
                  <tr><td colSpan="4" className="py-4 text-center text-gray-400 text-sm">No recent matches found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
