import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navFontStyle = {
    fontFamily: '"gameboy", "Courier New", Courier, monospace'
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* THE TOP BAR - Height is explicitly set to h-20 (80px) */}
      <nav className="fixed top-0 left-0 w-full h-20 z-[70] flex items-center justify-between px-6 bg-cyan-900/90 backdrop-blur-md border-b border-cyan-500/30">
        <div 
          onClick={() => { navigate('/'); setIsOpen(false); }}
          style={navFontStyle}
          className="text-xl sm:text-2xl font-bold text-white cursor-pointer drop-shadow-[0_0_0px_#00ffff]"
        >
          HTML <span className="text-cyan-400">HERO</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <button onClick={() => navigate('/About')} style={navFontStyle} className="text-sm tracking-widest text-white hover:text-cyan-400 transition-colors uppercase">About Us</button>
          <button onClick={() => navigate('/Login')} style={navFontStyle} className="text-sm bg-cyan-500 hover:bg-white text-black px-4 py-1.5 rounded-sm font-bold border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1">LOGIN</button>
        </div>

        {/* Hamburger Icon */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={toggleMenu}>
          <span className={`w-8 h-1 bg-cyan-400 transition-all ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
          <span className={`w-8 h-1 bg-cyan-400 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-8 h-1 bg-cyan-400 transition-all ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
        </button>
      </nav>

      {/* THE DROPDOWN MENU - Now starts AT the bottom of the navbar (top-20) */}
      <div 
        className={`fixed top-20 left-0 w-full bg-black/95 border-b border-cyan-500/50 z-[60] 
        transition-all duration-300 ease-in-out overflow-hidden md:hidden
        ${isOpen ? 'max-h-[400px] opacity-100 shadow-[0_20px_50px_rgba(0,255,255,0.2)]' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center py-10 gap-8">
          <button 
            onClick={() => { navigate('/about'); toggleMenu(); }} 
            style={navFontStyle} 
            className="text-xl tracking-widest text-white hover:text-cyan-400 uppercase"
          >
            ABOUT US
          </button>
          <button 
            onClick={() => navigate('/Login')}
            style={navFontStyle} 
            className="text-lg bg-cyan-500 text-black px-10 py-3 rounded-sm font-bold border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1"
          >
            LOGIN
          </button>
        </div>
      </div>
    </>
  );
}