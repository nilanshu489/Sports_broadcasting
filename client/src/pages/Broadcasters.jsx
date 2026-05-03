import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Edit, Tv, Search } from 'lucide-react';

export default function Broadcasters() {
  const [broadcasters, setBroadcasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ broadcaster_id: null, broadcaster_name: '', country: '', contact_email: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/broadcasters');
      setBroadcasters(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.broadcaster_id) {
        await api.put(`/broadcasters/${formData.broadcaster_id}`, formData);
      } else {
        await api.post('/broadcasters', formData);
      }
      setShowForm(false);
      setFormData({ broadcaster_id: null, broadcaster_name: '', country: '', contact_email: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete all channels associated too.')) return;
    try {
      await api.delete(`/broadcasters/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBroadcasters = broadcasters.filter(b => 
    b.broadcaster_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.country && b.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Broadcasters & Channels</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search broadcasters..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <button 
            onClick={() => { setShowForm(true); setFormData({ broadcaster_id: null, broadcaster_name: '', country: '', contact_email: '' }); }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-purple-500/20 shrink-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Broadcaster
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 border-purple-500/20">
          <h2 className="text-xl font-bold mb-4">{formData.broadcaster_id ? 'Edit' : 'Add'} Broadcaster</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input type="text" required value={formData.broadcaster_name} onChange={e => setFormData({...formData, broadcaster_name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
              <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input type="email" value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 text-center text-gray-400">Loading broadcasters...</div>
        ) : filteredBroadcasters.map((b) => (
          <div key={b.broadcaster_id} className="glass rounded-2xl p-6 relative group overflow-hidden border border-white/5 hover:border-purple-500/30 transition-colors">
            <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setFormData(b); setShowForm(true); }} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-md mr-1"><Edit className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(b.broadcaster_id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md"><Trash2 className="h-4 w-4" /></button>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mr-4">
                <Tv className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{b.broadcaster_name}</h3>
                <p className="text-sm text-gray-400">{b.country || 'Global'}</p>
              </div>
            </div>
            
            <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Contact:</span>
                <span className="truncate ml-2">{b.contact_email || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Channels Linked:</span>
                <span className="font-medium bg-purple-500/20 text-purple-300 px-2 rounded">{b.channel_count}</span>
              </div>
            </div>
          </div>
        ))}
        {!loading && filteredBroadcasters.length === 0 && (
          <div className="col-span-full py-12 text-center glass rounded-2xl text-gray-400">No broadcasters found.</div>
        )}
      </div>
    </div>
  );
}
