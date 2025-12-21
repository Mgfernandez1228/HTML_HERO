import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NotUIReactComponents/Navbar';

export default function Login() {
  const navigate = useNavigate();
  
  const themeFont = {
    fontFamily: '"gameboy", "Courier New", Courier, monospace'
  };

  return (
<>
    <Navbar />
    <div className="flex items-center justify-center min-h-screen w-full bg-black px-4">
      {/* Glow effect behind the box */}
      <div className="relative w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-xl border-2 border-cyan-500 rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 style={themeFont} className="text-3xl text-white drop-shadow-[0_0_8px_#00ffff] mb-2">
            PLAYER <span className="text-cyan-400">AUTH</span>
          </h2>
          <a style={themeFont} className="text-[10px] text-cyan-500/60 tracking-widest uppercase">
            Identify yourself, Hero
          </a>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label style={themeFont} className="block text-[12px] text-cyan-400 mb-2 uppercase ml-1">
              Username
            </label>
            <input 
              type="text" 
              placeholder="ENTER NAME..."
              style={themeFont}
              className="w-full bg-black border-b-2 border-gray-700 text-white p-3 outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600"
            />
          </div>

          <div>
            <label style={themeFont} className="block text-[12px] text-cyan-400 mb-2 uppercase ml-1">
              Password
            </label>
            <input 
              type="password" 
              placeholder="********"
              style={themeFont}
              className="w-full bg-black border-b-2 border-gray-700 text-white p-3 outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600"
            />
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              style={themeFont}
              className="w-full bg-cyan-500 hover:bg-white text-black font-bold py-4 rounded-sm transition-all border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 text-lg"
            >
              LOGIN
            </button>
            
            <button 
              onClick={() => navigate('/Title')}
              style={themeFont}
              className="w-full text-gray-500 hover:text-cyan-400 text-[10px] transition-colors uppercase tracking-widest"
            >
              [ Return to Title ]
            </button>
          </div>
        </form>

        {/* Decorative corner accents */}
        <div className="absolute top-[-2px] left-[-2px] w-4 h-4 border-t-2 border-l-2 border-white"></div>
        <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 border-b-2 border-r-2 border-white"></div>
      </div>
    </div>
</>
  );
}