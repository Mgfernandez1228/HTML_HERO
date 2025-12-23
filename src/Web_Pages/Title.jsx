import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { startGame } from '../main.jsx';
import MainButton from "../NotUIReactComponents/MainButton.jsx"

export default function Home(){

  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = (event) => {
      // 1. Hide the game canvas so the website is visible
      document.getElementById('game').style.display = 'none';
      document.getElementById('ui').style.display = 'none';
      document.getElementById('website-root').style.display = 'block';
      
      
      // 2. Actually move the page

      navigate(event.detail); 
      window.location.reload();// fix game double initialization bug
    };

    window.addEventListener('TERMINAL_NAVIGATE', handleNavigation);
    return () => window.removeEventListener('TERMINAL_NAVIGATE', handleNavigation);
  }, [navigate]);
    
  return (
<>
  <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black animate-gradient text-white px-4 sm:px-8">
    <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-12 lg:gap-16">
      <h1 style={{fontFamily: '"gameboy", "Courier New", Courier, monospace'}} className="font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white 
                      drop-shadow-[0_0_5px_#00ffff] 
                      [text-shadow:3px_5px_0px_#1a1a1a,6px_8px_15px_rgba(0,0,0,0.7)] 
                      breathe text-center">
        HTML HERO
      </h1>
      <div className="flex flex-col gap-4 sm:gap-6">
        <MainButton title="Start Game" func={startGame} />
        <MainButton title="Leaderboard" func={() => navigate('/Leaderboard')} />
        <MainButton title="Exit" func={() => navigate('/')} />
      </div>
    </div>
  </div>
</>
);

}

