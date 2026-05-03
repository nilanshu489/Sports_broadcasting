import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { DollarSign, ShieldCheck, Plus, Trash2, Edit, Search } from 'lucide-react';

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [mediaRights, setMediaRights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ sponsor_id: null, sponsor_name: '', industry_type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sponsorsRes, rightsRes] = await Promise.all([
        api.get('/sponsors'),
        api.get('/media-rights')
      ]);
      setSponsors(sponsorsRes.data);
      setMediaRights(rightsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSponsor = async (e) => {
    e.preventDefault();
    try {
      if (formData.sponsor_id) {
        await api.put(`/sponsors/${formData.sponsor_id}`, formData);
      } else {
        await api.post('/sponsors', formData);
      }
      setShowForm(false);
      setFormData({ sponsor_id: null, sponsor_name: '', industry_type: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving sponsor');
    }
  };

  const handleDeleteSponsor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sponsor?')) return;
    try {
      await api.delete(`/sponsors/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting sponsor');
    }
  };

  const filteredSponsors = sponsors.filter(s => 
    s.sponsor_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.industry_type && s.industry_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Sponsors & Media Rights</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search sponsors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sponsors List */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ShieldCheck className="h-6 w-6 text-emerald-400 mr-2" />
              <h2 className="text-xl font-bold">Corporate Sponsors</h2>
            </div>
            <button 
              onClick={() => { setShowForm(true); setFormData({ sponsor_id: null, sponsor_name: '', industry_type: '' }); }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg flex items-center text-sm transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Sponsor
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 bg-black/20 rounded-xl border border-emerald-500/30">
              <h3 className="font-bold mb-3 text-sm">{formData.sponsor_id ? 'Edit Sponsor' : 'Add New Sponsor'}</h3>
              <form onSubmit={handleSaveSponsor} className="space-y-3">
                <div>
                  <input type="text" required value={formData.sponsor_name} onChange={e => setFormData({...formData, sponsor_name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Sponsor Name" />
                </div>
                <div>
                  <input type="text" value={formData.industry_type} onChange={e => setFormData({...formData, industry_type: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Industry Type (e.g. Gaming)" />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm rounded bg-white/5 hover:bg-white/10">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 text-sm rounded bg-emerald-500 hover:bg-emerald-600 text-white">Save</button>
                </div>
              </form>
            </div>
          )}
          
          <div className="space-y-3">
            {loading ? <p className="text-gray-400">Loading...</p> : 
              filteredSponsors.map(s => (
                <div key={s.sponsor_id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                  <div>
                    <h3 className="font-bold">{s.sponsor_name}</h3>
                    <p className="text-xs text-emerald-400">{s.industry_type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setFormData(s); setShowForm(true); }} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteSponsor(s.sponsor_id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            }
            {!loading && filteredSponsors.length === 0 && <p className="text-gray-400 py-4 text-center">No sponsors found.</p>}
          </div>
        </div>

        {/* Media Rights Details */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <DollarSign className="h-6 w-6 text-emerald-400 mr-2" />
            <h2 className="text-xl font-bold">Media Rights Deals</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="py-2 px-2">Broadcaster</th>
                  <th className="py-2 px-2">Tournament</th>
                  <th className="py-2 px-2 text-right">Fee ($)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="3" className="py-4 text-gray-400 text-center">Loading...</td></tr> : 
                  mediaRights.map(mr => (
                    <tr key={mr.rights_id} className="border-b border-white/5">
                      <td className="py-3 px-2 font-medium">{mr.broadcaster_name}</td>
                      <td className="py-3 px-2 text-sm text-gray-300">{mr.tournament_name}</td>
                      <td className="py-3 px-2 text-sm text-right text-emerald-400 font-mono">${parseFloat(mr.rights_fee).toLocaleString()}</td>
                    </tr>
                  ))
                }
                {mediaRights.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-gray-400">No media rights recorded.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
