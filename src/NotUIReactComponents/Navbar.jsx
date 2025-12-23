import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show the navbar on the site Home ("/"). All other routes render no navbar.
  if (location.pathname !== '/') return null;
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Check for logged in user
  const username = localStorage.getItem('username');

  const navFontStyle = {
    fontFamily: '"gameboy", "Courier New", Courier, monospace'
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // When the navbar is present, add a class to the website root so global
  // layout (padding for the fixed nav) is only applied when the nav exists.
  useEffect(() => {
    const root = document.getElementById('website-root');
    if (root) root.classList.add('with-navbar');
    return () => { if (root) root.classList.remove('with-navbar'); };
  }, []);

  // 2. Clear session and return to Home/Login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
    setIsOpen(false);
    navigate('/');
    // Optional: window.location.reload() ensures all states are wiped
  };

  return (
    <>
      <nav style={{ height: 'var(--navbar-height)' }} className="fixed top-0 left-0 w-full z-[70] flex items-center justify-between px-6 bg-cyan-900/90 backdrop-blur-md border-b border-cyan-500/30">
        <div 
          onClick={() => { navigate('/'); setIsOpen(false); }}
          style={navFontStyle}
          className="text-xl sm:text-2xl font-bold text-white cursor-pointer"
        >
          HTML <span className="text-cyan-400">HERO</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <button onClick={() => navigate('/About')} style={navFontStyle} className="text-sm tracking-widest text-white hover:text-cyan-400 uppercase transition-colors">About Us</button>
          
          {/* 3. Toggle Login vs Username/Signout */}
          {username ? (
            <div className="flex items-center gap-6">
              <span style={navFontStyle} className="text-xs text-cyan-400 uppercase">HERO: {username}</span>
              <button 
                onClick={handleLogout} 
                style={navFontStyle} 
                className="text-sm bg-red-600 hover:bg-white text-black px-4 py-1.5 rounded-sm font-bold border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
              >
                SIGNOUT
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/Login')} 
              style={navFontStyle} 
              className="text-sm bg-cyan-500 hover:bg-white text-black px-4 py-1.5 rounded-sm font-bold border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              LOGIN
            </button>
          )}
        </div>

        {/* Hamburger Icon */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={toggleMenu}>
          <span className={`w-8 h-1 bg-cyan-400 transition-all ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
          <span className={`w-8 h-1 bg-cyan-400 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-8 h-1 bg-cyan-400 transition-all ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <div 
        style={{ top: 'var(--navbar-height)' }}
        className={`fixed left-0 w-full bg-black/95 border-b border-cyan-500/50 z-[60] 
        transition-all duration-300 ease-in-out overflow-hidden md:hidden
        ${isOpen ? 'max-h-[400px] opacity-100 shadow-[0_20px_50px_rgba(0,255,255,0.2)]' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center py-10 gap-8">
          <button 
            onClick={() => { navigate('/About'); toggleMenu(); }} 
            style={navFontStyle} 
            className="text-xl tracking-widest text-white hover:text-cyan-400 uppercase"
          >
            ABOUT US
          </button>

          {username ? (
            <>
              <p style={navFontStyle} className="text-cyan-400 uppercase text-sm">HERO: {username}</p>
              <button 
                onClick={handleLogout}
                style={navFontStyle} 
                className="text-lg bg-red-600 text-black px-10 py-3 rounded-sm font-bold border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <button 
              onClick={() => { navigate('/Login'); toggleMenu(); }}
              style={navFontStyle} 
              className="text-lg bg-cyan-500 text-black px-10 py-3 rounded-sm font-bold border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </>
  );
}