import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NotUIReactComponents/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const pixelFont = {
    fontFamily: '"gameboy", "Courier New", Courier, monospace'
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* 1. HERO SECTION: The Pitch */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-6">
          <h1 style={pixelFont} className="text-4xl md:text-6xl lg:text-7xl leading-tight">
            THE WEB IS IN <span className="text-cyan-500">TROUBLE.</span> <br />
            A HERO IS NEEDED.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            HTML HERO is a educational resource designed to teach basic html, css, and javascript through a retro style rpg.
          </p>
          
          <div className="pt-8">
            
              <button 
                onClick={() => navigate('/Title')}
                style={pixelFont}
                className="border-2 border-white px-10 py-4 hover:bg-white hover:text-black transition-all text-xl tracking-tighter"
              >
                PLAY GAME
              </button>
            
              
          </div>
        </div>
      </section>

    </div>
  );
}