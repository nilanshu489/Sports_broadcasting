import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Search, X, Users, Shield, MapPin, Tv, DollarSign, Trophy } from 'lucide-react';
import api from '../../api/axios';

const typeIcons = {
  player: Users,
  team: Shield,
  stadium: MapPin,
  broadcaster: Tv,
  sponsor: DollarSign,
  match: Trophy,
};

const typeColors = {
  player: 'text-blue-400 bg-blue-400/10',
  team: 'text-emerald-400 bg-emerald-400/10',
  stadium: 'text-rose-400 bg-rose-400/10',
  broadcaster: 'text-purple-400 bg-purple-400/10',
  sponsor: 'text-amber-400 bg-amber-400/10',
  match: 'text-cyan-400 bg-cyan-400/10',
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/dashboard/search?q=${searchTerm}`);
        setSearchResults(res.data);
        setShowResults(true);
      } catch (err) { console.error('Search error:', err); }
      finally { setIsSearching(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleResultClick = (result) => {
    setSearchTerm('');
    setShowResults(false);
    navigate(`/${result.type}s`);
  };

  // Group results by type
  const grouped = searchResults.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-30">
          <button 
            className="lg:hidden text-gray-400 hover:text-white p-2 -ml-2 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Global Search Bar */}
          <div className="relative w-full max-w-md ml-auto" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search players, teams, stadiums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder-gray-500 text-white transition-all"
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setSearchResults([]); setShowResults(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50" style={{animation: 'fadeIn 0.15s ease-out'}}>
                {isSearching ? (
                  <div className="p-4 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    Searching...
                  </div>
                ) : Object.keys(grouped).length > 0 ? (
                  Object.entries(grouped).map(([type, items]) => {
                    const Icon = typeIcons[type] || Users;
                    const colorClass = typeColors[type] || 'text-gray-400 bg-white/10';
                    return (
                      <div key={type}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white/[0.02] border-b border-white/5">
                          {type}s
                        </div>
                        {items.map((result, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleResultClick(result)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center gap-3 transition-colors"
                          >
                            <div className={`p-1.5 rounded-lg ${colorClass}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-white text-sm">{result.name}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-400 text-sm">No results found for "{searchTerm}"</div>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
