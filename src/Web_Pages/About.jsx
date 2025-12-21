import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NotUIReactComponents/Navbar";

export default function About() {
  const navigate = useNavigate();

  const pixelFont = {
    fontFamily: '"gameboy", "Courier New", Courier, monospace'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        {/* Simple Header */}
        <h1 style={pixelFont} className="text-3xl mb-12 border-b border-gray-800 pb-4">
          About HTML Hero
        </h1>

        {/* What is it? */}
        <section className="mb-12 space-y-6">
          <h2 style={pixelFont} className="text-cyan-500 text-lg uppercase">The Project</h2>
          <p className="text-gray-300 leading-relaxed">
            HTML Hero is an educational retro style game designed to help beginer web developers learn and practice markup syntax in a fun and engaging way.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-12 space-y-6">
          <h2 style={pixelFont} className="text-cyan-500 text-lg uppercase">How It Works</h2>
          <p className="text-gray-300 leading-relaxed">
            Players have to beat three levels testing users on proper syntax for HTML, CSS, and JavaScript. 
          </p>
        </section>


        {/* Simple Footer Link */}
        <div className="pt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            style={pixelFont}
            className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            [ Back to Home ]
          </button>
        </div>
      </main>
    </div>
  );
}