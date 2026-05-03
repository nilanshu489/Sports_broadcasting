import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Edit, Search } from 'lucide-react';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [broadcasters, setBroadcasters] = useState([]);
  const [sports, setSports] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(''); // 'International', 'National', 'Franchise'
  const [selectedTournament, setSelectedTournament] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    match_id: null, match_date: '', start_time: '', match_status: 'Scheduled', 
    season_id: '', stadium_id: '', broadcaster_id: '', end_time: '' 
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [stadiumsRes, seasonsRes, broadcastersRes, sportsRes, tourneysRes] = await Promise.all([
          api.get('/stadiums'),
          api.get('/seasons'),
          api.get('/broadcasters'),
          api.get('/sports'),
          api.get('/tournaments')
        ]);
        setStadiums(stadiumsRes.data);
        setSeasons(seasonsRes.data);
        setBroadcasters(broadcastersRes.data);
        setSports(sportsRes.data);
        setTournaments(tourneysRes.data);
      } catch (err) { console.error(err); }
    };
    fetchInitialData();
  }, []);

  const fetchMatches = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      let url = '/matches?';
      if (selectedSport) url += `sport_id=${selectedSport}&`;
      if (selectedLevel) url += `level=${selectedLevel}&`;
      if (selectedLevel === 'Franchise' && selectedTournament) url += `tournament_id=${selectedTournament}`;
      const res = await api.get(url);
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // Live Score Polling
    const interval = setInterval(() => {
      fetchMatches(false); // pass false to avoid loading flicker
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedSport, selectedLevel, selectedTournament]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Transaction logic is handled by the backend if broadcaster_id is provided on POST
      if (formData.match_id) {
        await api.put(`/matches/${formData.match_id}`, formData);
      } else {
        await api.post('/matches', formData);
      }
      setShowForm(false);
      resetForm();
      fetchMatches();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving match');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;
    try {
      await api.delete(`/matches/${id}`);
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => setFormData({ 
    match_id: null, match_date: '', start_time: '', match_status: 'Scheduled', 
    season_id: '', stadium_id: '', broadcaster_id: '', end_time: '' 
  });

  const filteredMatches = matches.filter(m => 
    (m.tournament_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.stadium_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.match_status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Match Management</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search matches..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Match
          </button>
        </div>
      </div>

      {/* Filters Hierarchy */}
      <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
        {/* Sport Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setSelectedSport('')} className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${selectedSport === '' ? 'bg-amber-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            All Sports
          </button>
          {sports.map(s => (
            <button key={s.sport_id} onClick={() => { setSelectedSport(s.sport_id); setSelectedLevel(''); setSelectedTournament(''); }} className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${selectedSport === s.sport_id ? 'bg-amber-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
              {s.sport_name}
            </button>
          ))}
        </div>

        {/* Level Tabs */}
        {selectedSport && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setSelectedLevel('')} className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors text-xs font-medium uppercase tracking-wider ${selectedLevel === '' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}>All Levels</button>
            <button onClick={() => { setSelectedLevel('International'); setSelectedTournament(''); }} className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors text-xs font-medium uppercase tracking-wider ${selectedLevel === 'International' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}>International</button>
            <button onClick={() => { setSelectedLevel('National'); setSelectedTournament(''); }} className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors text-xs font-medium uppercase tracking-wider ${selectedLevel === 'National' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}>National</button>
            <button onClick={() => setSelectedLevel('Franchise')} className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors text-xs font-medium uppercase tracking-wider ${selectedLevel === 'Franchise' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}>Franchise</button>
          </div>
        )}

        {/* League Pills (Only if Franchise is selected) */}
        {selectedSport && selectedLevel === 'Franchise' && (
          <div className="flex gap-2 flex-wrap pt-2 border-t border-white/10">
            <button onClick={() => setSelectedTournament('')} className={`px-3 py-1 rounded-full border transition-colors text-xs font-medium ${selectedTournament === '' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'border-white/20 hover:border-white/40 text-gray-400'}`}>
              All Leagues
            </button>
            {tournaments.filter(t => t.sport_id == selectedSport && t.tournament_level === 'Franchise').map(t => (
              <button key={t.tournament_id} onClick={() => setSelectedTournament(t.tournament_id)} className={`px-3 py-1 rounded-full border transition-colors text-xs font-medium ${selectedTournament === t.tournament_id ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'border-white/20 hover:border-white/40 text-gray-400'}`}>
                {t.tournament_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 border-amber-500/20">
          <h2 className="text-xl font-bold mb-4">{formData.match_id ? 'Edit Match' : 'Create Match (Transaction Enabled)'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
              <input type="date" required value={formData.match_date ? formData.match_date.substring(0,10) : ''} onChange={e => setFormData({...formData, match_date: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Start Time</label>
              <input type="time" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select value={formData.match_status} onChange={e => setFormData({...formData, match_status: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none text-white">
                <option value="Scheduled">Scheduled</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Stadium</label>
              <select value={formData.stadium_id} onChange={e => setFormData({...formData, stadium_id: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none text-white">
                <option value="">Select Stadium...</option>
                {stadiums.map(s => <option key={s.stadium_id} value={s.stadium_id}>{s.stadium_name} ({s.city})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Season/Tournament</label>
              <select value={formData.season_id} onChange={e => setFormData({...formData, season_id: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none text-white">
                <option value="">Select Season...</option>
                {seasons.map(s => <option key={s.season_id} value={s.season_id}>{s.tournament_name} {s.season_year}</option>)}
              </select>
            </div>
            
            {/* Broadcaster - Only show on create for transaction demo */}
            {!formData.match_id && (
              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <label className="block text-sm font-medium text-amber-300 mb-1">Assign Broadcaster (Transaction)</label>
                <select value={formData.broadcaster_id} onChange={e => setFormData({...formData, broadcaster_id: e.target.value})} className="w-full bg-surface border border-amber-500/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none text-white mb-2">
                  <option value="">None (Skip Schedule)</option>
                  {broadcasters.map(b => <option key={b.broadcaster_id} value={b.broadcaster_id}>{b.broadcaster_name}</option>)}
                </select>
                {formData.broadcaster_id && (
                  <input type="time" title="End Time" placeholder="End Time" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full bg-surface border border-amber-500/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm" />
                )}
              </div>
            )}

            <div className="md:col-span-3 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">Save Match</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-2xl p-6">
        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading matches...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-3 px-4 font-medium">Date & Time</th>
                  <th className="py-3 px-4 font-medium">Matchup (Live Scores)</th>
                  <th className="py-3 px-4 font-medium">Tournament</th>
                  <th className="py-3 px-4 font-medium">Stadium</th>
                  <th className="py-3 px-4 font-medium">Status & Link</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((match) => (
                  <tr key={match.match_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium">{new Date(match.match_date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{match.start_time}</div>
                    </td>
                    <td className="py-3 px-4">
                      {match.home_team_name ? (
                        <div className="font-bold flex items-center gap-2">
                          <span className="text-right w-24 truncate" title={match.home_team_name}>{match.home_team_name}</span>
                          <span className="bg-white/10 px-2 py-1 rounded text-amber-400 text-sm">{match.home_score}</span>
                          <span className="text-gray-500 text-sm">-</span>
                          <span className="bg-white/10 px-2 py-1 rounded text-amber-400 text-sm">{match.away_score}</span>
                          <span className="text-left w-24 truncate" title={match.away_team_name}>{match.away_team_name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-400 italic text-sm">Teams TBD</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{match.tournament_name || 'No Tournament'}</div>
                      <div className="text-xs text-gray-400">{match.season_year}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">{match.stadium_name || 'TBA'}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          match.match_status === 'Scheduled' ? 'bg-amber-400/20 text-amber-400' :
                          match.match_status === 'Live' ? 'bg-emerald-400/20 text-emerald-400 animate-pulse' :
                          'bg-gray-400/20 text-gray-400'
                        }`}>
                          {match.match_status}
                        </span>
                        {/* LIVE → Watch Live button */}
                        {match.match_status === 'Live' && match.stream_url && (
                          <a href={match.stream_url} target="_blank" rel="noreferrer" className="flex items-center text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-1 rounded hover:bg-red-600/40 transition">
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
                            Watch Live
                          </a>
                        )}
                        {/* COMPLETED → Watch Highlights button */}
                        {match.match_status === 'Completed' && match.highlight_url && (
                          <a href={match.highlight_url} target="_blank" rel="noreferrer" className="flex items-center text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded hover:bg-blue-600/40 transition">
                            ▶ Watch Highlights
                          </a>
                        )}
                        {/* SCHEDULED → just show kickoff time, no button */}
                        {match.match_status === 'Scheduled' && (
                          <span className="text-xs text-gray-500">
                            Starts {match.start_time?.substring(0, 5)} IST
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 flex justify-end gap-2">
                      <button onClick={() => { setFormData({...match, match_date: match.match_date.substring(0,10), season_id: match.season_id || '', stadium_id: match.stadium_id || ''}); setShowForm(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit (Uses SELECT FOR UPDATE concurrency control)">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(match.match_id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMatches.length === 0 && (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-400">No matches found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
