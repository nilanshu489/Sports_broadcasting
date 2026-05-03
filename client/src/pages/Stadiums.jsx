import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

export default function Stadiums() {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ stadium_id: null, stadium_name: '', city: '', capacity: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stadiums');
      setStadiums(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.stadium_id) {
        await api.put(`/stadiums/${formData.stadium_id}`, formData);
      } else {
        await api.post('/stadiums', formData);
      }
      setShowForm(false);
      setFormData({ stadium_id: null, stadium_name: '', city: '', capacity: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving stadium');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stadium?')) return;
    try {
      await api.delete(`/stadiums/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting stadium');
    }
  };

  const filteredStadiums = stadiums.filter(s => 
    s.stadium_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.city && s.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Stadiums Management</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search stadiums by name or city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={() => { setShowForm(true); setFormData({ stadium_id: null, stadium_name: '', city: '', capacity: '' }); }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Stadium
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 border-indigo-500/20">
          <h2 className="text-xl font-bold mb-4">{formData.stadium_id ? 'Edit Stadium' : 'Add New Stadium'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Stadium Name</label>
              <input type="text" required value={formData.stadium_name} onChange={e => setFormData({...formData, stadium_name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
              <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Capacity</label>
              <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-2xl p-6">

        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading stadiums...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-3 px-4 font-medium">Stadium Name</th>
                  <th className="py-3 px-4 font-medium">City</th>
                  <th className="py-3 px-4 font-medium">Capacity</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStadiums.map((stadium) => (
                  <tr key={stadium.stadium_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{stadium.stadium_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{stadium.city || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{stadium.capacity ? parseInt(stadium.capacity).toLocaleString() : '-'}</td>
                    <td className="py-3 px-4 flex justify-end gap-2">
                      <button onClick={() => { setFormData(stadium); setShowForm(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(stadium.stadium_id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStadiums.length === 0 && (
                  <tr><td colSpan="4" className="py-8 text-center text-gray-400">No stadiums found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
