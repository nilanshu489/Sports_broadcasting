import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

const SPORT_ROLES_BY_NAME = {
  'Cricket': ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'],
  'Football': ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
  'Basketball': ['Guard', 'Forward', 'Center'],
  'Baseball': ['Pitcher', 'Catcher', 'First Baseman', 'Second Baseman', 'Third Baseman', 'Shortstop', 'Outfielder', 'Designated Hitter']
};

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ player_id: null, player_name: '', role: '', nationality: '', team_ids: [], sport_id: '' });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [teamsRes, sportsRes] = await Promise.all([
          api.get('/teams'),
          api.get('/sports')
        ]);
        setTeams(teamsRes.data);
        setSports(sportsRes.data);
      } catch (err) { console.error(err); }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [selectedSport]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/players${selectedSport ? `?sport_id=${selectedSport}` : ''}`);
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.player_id) {
        await api.put(`/players/${formData.player_id}`, formData);
      } else {
        await api.post('/players', formData);
      }
      setShowForm(false);
      setFormData({ player_id: null, player_name: '', role: '', nationality: '', team_ids: [], sport_id: '' });
      fetchPlayers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    try {
      await api.delete(`/players/${id}`);
      fetchPlayers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPlayers = players.filter(p => 
    p.player_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.team_name && p.team_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleTeam = (teamId) => {
    setFormData(prev => {
      const isSelected = prev.team_ids.includes(teamId);
      if (isSelected) {
        return { ...prev, team_ids: prev.team_ids.filter(id => id !== teamId) };
      } else {
        return { ...prev, team_ids: [...prev.team_ids, teamId] };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Players Management</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search players..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button 
            onClick={() => { setShowForm(true); setFormData({ player_id: null, player_name: '', role: '', nationality: '', team_ids: [], sport_id: selectedSport }); }}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center transition-colors shrink-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Player
          </button>
        </div>
      </div>

      {/* Sport Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedSport('')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${selectedSport === '' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
        >
          All Sports
        </button>
        {sports.map(s => (
          <button
            key={s.sport_id}
            onClick={() => setSelectedSport(s.sport_id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${selectedSport === s.sport_id ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            {s.sport_name}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">{formData.player_id ? 'Edit Player' : 'Add New Player'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Player Name</label>
              <input type="text" required value={formData.player_name} onChange={e => setFormData({...formData, player_name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
              {formData.sport_id ? (
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none text-white">
                  <option value="">Select Role</option>
                  {(sports.find(s => s.sport_id == formData.sport_id) && SPORT_ROLES_BY_NAME[sports.find(s => s.sport_id == formData.sport_id).sport_name])?.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              ) : (
                <select disabled className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 opacity-50 outline-none text-gray-500">
                  <option>Select a Sport First</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nationality</label>
              <input type="text" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Sport</label>
              <select value={formData.sport_id} onChange={e => setFormData({...formData, sport_id: e.target.value, role: ''})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none text-white">
                <option value="">Select Sport</option>
                {sports.map(s => <option key={s.sport_id} value={s.sport_id}>{s.sport_name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Teams</label>
              <div className="bg-surface border border-white/10 rounded-lg p-3 max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teams.filter(t => !formData.sport_id || t.sport_id == formData.sport_id).length === 0 ? (
                  <div className="text-gray-500 text-sm">No teams available for this sport.</div>
                ) : (
                  teams.filter(t => !formData.sport_id || t.sport_id == formData.sport_id).map(t => (
                    <label key={t.team_id} className="flex items-center space-x-2 cursor-pointer text-sm">
                      <input 
                        type="checkbox" 
                        checked={formData.team_ids.includes(t.team_id)}
                        onChange={() => toggleTeam(t.team_id)}
                        className="rounded border-white/20 bg-black/20 text-primary focus:ring-primary focus:ring-offset-gray-900"
                      />
                      <span>{t.team_name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-2xl p-6">

        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading players...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Role</th>
                  <th className="py-3 px-4 font-medium">Nationality</th>
                  <th className="py-3 px-4 font-medium">Team</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => (
                  <tr key={player.player_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{player.player_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{player.role || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{player.nationality || '-'}</td>
                    <td className="py-3 px-4 text-sm">
                      {player.team_name ? (
                        <span className="bg-white/10 px-2 py-1 rounded text-xs">{player.team_name}</span>
                      ) : (
                        <span className="text-gray-500 italic text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex justify-end gap-2">
                      <button onClick={() => { setFormData({...player, team_ids: player.team_ids || []}); setShowForm(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(player.player_id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPlayers.length === 0 && (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-400">No players found matching your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
