import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainButton from "../NotUIReactComponents/MainButton.jsx";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [players] = useState(Array(10).fill({ _id: "1", username: "PLAYER", score: 1000 })); // Mocking 10 players

  const retroFont = { fontFamily: '"gameboy", "Courier New", Courier, monospace' };

  return (
    <div className="min-h-screen w-full bg-black animate-gradient text-white flex flex-col items-center p-4 sm:p-8">
      
      {/* 1. Title - Shrunk for mobile */}
      <h1 
        style={retroFont} 
        className="text-3xl sm:text-5xl md:text-6xl text-white drop-shadow-[0_0_15px_#00ffff] breathe mt-4 mb-6 text-center"
      >
        RANKINGS
      </h1>

      {/* 2. Main Container - Uses max-height to ensure it doesn't push the button off-screen */}
      <div className="w-full max-w-2xl bg-[#1a1a1a] border-4 border-[#333] rounded-lg shadow-[8px_8px_0px_#000] flex flex-col overflow-hidden mb-6">
        
        {/* Scrollable List Area */}
        <ul className="overflow-y-auto max-h-[50vh] sm:max-h-[60vh] p-4 sm:p-6 space-y-4 custom-scrollbar">
          {players.map((player, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-b border-[#333] pb-2 group hover:border-[#00ffff] transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <span style={retroFont} className="text-base sm:text-xl text-[#00ffff] shrink-0">
                  {index + 1}.
                </span>
                <span style={retroFont} className="text-sm sm:text-lg uppercase tracking-tight sm:tracking-widest truncate">
                  {player.username}
                </span>
              </div>

              <span style={retroFont} className="text-sm sm:text-lg text-yellow-400 shrink-0 ml-2">
                {player.score.toString().padStart(6, '0')}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Back Button - Always visible at the bottom */}
      <div className="pb-8 w-full flex justify-center">
        <MainButton title="GO BACK" func={() => navigate('/')} />
      </div>

      {/* Retro Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border: 1px solid #00ffff; }
      `}} />
    </div>
  );
}