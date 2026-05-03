import React, { useState, useEffect } from 'react';
import { Users, Shield, Trophy, Video, MapPin, DollarSign, Radio } from 'lucide-react';
import api from '../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
  RadialBarChart, RadialBar,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22d3ee', '#10b981'];
const STATUS_COLORS = { Live: '#22c55e', Scheduled: '#f59e0b', Completed: '#6b7280', Cancelled: '#ef4444' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 shadow-xl text-sm">
      <p className="text-gray-400 mb-1">{label || payload[0]?.name}</p>
      <p className="text-white font-bold">{payload[0]?.value}</p>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
    // Auto-refresh for live data
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  if (!stats) return (
    <div className="p-10 text-center glass rounded-2xl border-red-500/20">
      <h2 className="text-xl text-red-400 font-bold mb-2">Database Connection Failed</h2>
      <p className="text-gray-400">Could not load dashboard statistics.</p>
    </div>
  );

  const statCards = [
    { title: 'Players', value: stats.total_players, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Teams', value: stats.total_teams, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Matches', value: stats.total_matches, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { title: 'Live Now', value: stats.live_matches, icon: Radio, color: 'text-red-400', bg: 'bg-red-400/10', pulse: true },
    { title: 'Stadiums', value: stats.total_stadiums, icon: MapPin, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { title: 'Broadcasters', value: stats.total_broadcasters, icon: Video, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Sponsors', value: stats.total_sponsors, icon: DollarSign, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ];

  // Prepare radial bar data for Teams by Level
  const radialData = (stats.teamsByLevel || []).map((item, i) => ({
    name: item.team_level,
    value: item.team_count,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="glass rounded-2xl p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
            <div className={`p-3 rounded-xl ${card.bg} mb-2 ${card.pulse ? 'animate-pulse' : ''}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-white">{card.value}</h3>
            <p className="text-gray-500 text-xs font-medium mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Row 1: Players per Sport + Match Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players per Sport — Pie Chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-white">Players per Sport</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.playersPerSport}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={4}
                  dataKey="player_count"
                  nameKey="sport_name"
                  label={({ sport_name, player_count }) => `${sport_name}: ${player_count}`}
                  labelLine={false}
                >
                  {(stats.playersPerSport || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match Status — Donut */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-white">Match Status Breakdown</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.matchStatusBreakdown}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={95}
                  paddingAngle={3}
                  dataKey="status_count"
                  nameKey="match_status"
                  label={({ match_status, status_count }) => `${match_status}: ${status_count}`}
                  labelLine={false}
                >
                  {(stats.matchStatusBreakdown || []).map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.match_status] || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Matches per Sport + Teams by Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matches per Sport — Bar Chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-white">Matches per Sport</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.matchesPerSport} barCategoryGap="25%">
                <XAxis dataKey="sport_name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="match_count" radius={[6, 6, 0, 0]}>
                  {(stats.matchesPerSport || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Teams by Level — Radial Bar */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-white">Teams by Level</h2>
          <div className="h-[280px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="30%" outerRadius="90%"
                data={radialData}
                startAngle={180} endAngle={0}
              >
                <RadialBar
                  background={{ fill: 'rgba(255,255,255,0.05)' }}
                  dataKey="value"
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconSize={10}
                  layout="horizontal"
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Top Stadiums + Sponsors per Sport */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Stadiums — Horizontal Bar */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-white">Top Stadiums by Capacity</h2>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topStadiums} layout="vertical" barCategoryGap="20%">
                <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="stadium_name" type="category" width={140} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="capacity" radius={[0, 6, 6, 0]}>
                  {(stats.topStadiums || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sponsors per Sport — Bar */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-white">Sponsors per Sport</h2>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.sponsorsPerSport} barCategoryGap="25%">
                <XAxis dataKey="sport_name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="sponsor_count" radius={[6, 6, 0, 0]}>
                  {(stats.sponsorsPerSport || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Matches with Scores */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 text-white">Recent Matches</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Matchup</th>
                <th className="py-3 px-4 font-medium">Tournament</th>
                <th className="py-3 px-4 font-medium">Stadium</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentMatches.map((match) => (
                <tr key={match.match_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm">{new Date(match.match_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm">
                    {match.home_team_name ? (
                      <span className="font-medium">
                        {match.home_team_name} <span className="text-amber-400">{match.home_score}</span>
                        <span className="text-gray-500 mx-1">-</span>
                        <span className="text-amber-400">{match.away_score}</span> {match.away_team_name}
                      </span>
                    ) : 'TBD'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">{match.tournament_name || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{match.stadium_name || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.match_status === 'Live' ? 'bg-emerald-400/20 text-emerald-400 animate-pulse' :
                      match.match_status === 'Scheduled' ? 'bg-amber-400/20 text-amber-400' :
                      'bg-gray-400/20 text-gray-400'
                    }`}>
                      {match.match_status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentMatches.length === 0 && (
                <tr><td colSpan="5" className="py-4 text-center text-gray-400 text-sm">No recent matches found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
