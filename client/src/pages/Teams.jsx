import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

export default function Teams() {
  const [teams, setTeams] = useState([]);
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
  const [formData, setFormData] = useState({ team_id: null, team_name: '', home_city: '', coach_name: '', sport_id: '', team_level: 'Franchise', tournament_id: '' });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [sportsRes, tourneysRes] = await Promise.all([
          api.get('/sports'),
          api.get('/tournaments')
        ]);
        setSports(sportsRes.data);
        setTournaments(tourneysRes.data);
      } catch (err) { console.error(err); }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [selectedSport, selectedLevel, selectedTournament]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      let url = '/teams?';
      if (selectedSport) url += `sport_id=${selectedSport}&`;
      if (selectedLevel) url += `team_level=${selectedLevel}&`;
      if (selectedLevel === 'Franchise' && selectedTournament) url += `tournament_id=${selectedTournament}`;
      const res = await api.get(url);
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.team_id) {
        await api.put(`/teams/${formData.team_id}`, formData);
      } else {
        await api.post('/teams', formData);
      }
      setShowForm(false);
      setFormData({ team_id: null, team_name: '', home_city: '', coach_name: '', sport_id: '', team_level: 'Franchise', tournament_id: '' });
      fetchTeams();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving team');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await api.delete(`/teams/${id}`);
      fetchTeams();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting team');
    }
  };

  const filteredTeams = teams.filter(t => 
    t.team_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.home_city && t.home_city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Teams Management</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search teams by name or city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button 
            onClick={() => { setShowForm(true); setFormData({ team_id: null, team_name: '', home_city: '', coach_name: '', sport_id: selectedSport, team_level: selectedLevel || 'Franchise', tournament_id: selectedTournament }); }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-emerald-500/20 shrink-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Team
          </button>
        </div>
      </div>

      {/* Filters Hierarchy */}
      <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
        {/* Sport Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setSelectedSport('')} className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${selectedSport === '' ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            All Sports
          </button>
          {sports.map(s => (
            <button key={s.sport_id} onClick={() => { setSelectedSport(s.sport_id); setSelectedLevel(''); setSelectedTournament(''); }} className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${selectedSport === s.sport_id ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
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
            <button onClick={() => setSelectedTournament('')} className={`px-3 py-1 rounded-full border transition-colors text-xs font-medium ${selectedTournament === '' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-white/20 hover:border-white/40 text-gray-400'}`}>
              All Leagues
            </button>
            {tournaments.filter(t => t.sport_id == selectedSport && t.tournament_level === 'Franchise').map(t => (
              <button key={t.tournament_id} onClick={() => setSelectedTournament(t.tournament_id)} className={`px-3 py-1 rounded-full border transition-colors text-xs font-medium ${selectedTournament === t.tournament_id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-white/20 hover:border-white/40 text-gray-400'}`}>
                {t.tournament_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 border-emerald-500/20">
          <h2 className="text-xl font-bold mb-4">{formData.team_id ? 'Edit Team' : 'Add New Team'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
              <input type="text" required value={formData.team_name} onChange={e => setFormData({...formData, team_name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Home City</label>
              <input type="text" value={formData.home_city} onChange={e => setFormData({...formData, home_city: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. London" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Coach Name</label>
              <input type="text" value={formData.coach_name} onChange={e => setFormData({...formData, coach_name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Sport</label>
              <select value={formData.sport_id} onChange={e => setFormData({...formData, sport_id: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-white">
                <option value="">Select Sport</option>
                {sports.map(s => <option key={s.sport_id} value={s.sport_id}>{s.sport_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Level</label>
              <select value={formData.team_level} onChange={e => setFormData({...formData, team_level: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-white">
                <option value="International">International</option>
                <option value="National">National</option>
                <option value="Franchise">Franchise</option>
              </select>
            </div>
            {formData.team_level === 'Franchise' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">League</label>
                <select value={formData.tournament_id} onChange={e => setFormData({...formData, tournament_id: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-white">
                  <option value="">Select League</option>
                  {tournaments.filter(t => t.tournament_level === 'Franchise' && (!formData.sport_id || t.sport_id == formData.sport_id)).map(t => 
                    <option key={t.tournament_id} value={t.tournament_id}>{t.tournament_name}</option>
                  )}
                </select>
              </div>
            )}
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-2xl p-6">

        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading teams...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-3 px-4 font-medium">Team Name</th>
                  <th className="py-3 px-4 font-medium">Home City</th>
                  <th className="py-3 px-4 font-medium">Coach</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.team_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{team.team_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{team.home_city || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{team.coach_name || '-'}</td>
                    <td className="py-3 px-4 flex justify-end gap-2">
                      <button onClick={() => { setFormData(team); setShowForm(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(team.team_id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTeams.length === 0 && (
                  <tr><td colSpan="4" className="py-8 text-center text-gray-400">No teams found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
