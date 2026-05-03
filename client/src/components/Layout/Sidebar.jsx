import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, CalendarDays, 
  Video, DollarSign, LogOut, Menu, X, MapPin 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Players', path: '/players', icon: Users },
  { name: 'Teams', path: '/teams', icon: Shield },
  { name: 'Matches', path: '/matches', icon: CalendarDays },
  { name: 'Stadiums', path: '/stadiums', icon: MapPin },
  { name: 'Broadcasters', path: '/broadcasters', icon: Video },
  { name: 'Sponsors & Rights', path: '/sponsors', icon: DollarSign },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-white/10 transition-transform duration-300 lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">SportsCast</span>
          <button className="ml-auto lg:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3 shrink-0" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center px-4 py-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
