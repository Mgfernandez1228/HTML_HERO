import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainButton from "../NotUIReactComponents/MainButton.jsx";
import Navbar from '../NotUIReactComponents/Navbar.jsx';

export default function ScorePage() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Retrieve the score saved by Kaplay before the reload
    const savedScore = localStorage.getItem("finalScore");
    if (savedScore) {
      setScore(savedScore);
    }
  }, []);

  const handlePlayAgain = () => {
    // Clear score and go home to restart
    localStorage.removeItem("finalScore");
    navigate('/Home'); // Or wherever your game starts
    window.location.reload(); 
  };

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black animate-gradient text-white px-4 sm:px-8">
        <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-16 lg:gap-20">
          
          {/* Header Styled like HTML HERO */}
          <div className="flex flex-col items-center gap-4">
            <h1 
              style={{fontFamily: '"gameboy", "Courier New", Courier, monospace'}} 
              className="font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white 
                        drop-shadow-[0_0_5px_#ff00ff] 
                        [text-shadow:3px_5px_0px_#1a1a1a,6px_8px_15px_rgba(0,0,0,0.7)] 
                        breathe text-center"
            >
              MISSION COMPLETE
            </h1>
            <p className="text-cyan-400 font-mono text-xl tracking-widest uppercase">
              Final Results Analyzed
            </p>
          </div>

          {/* The Big Score Display */}
          <div className="flex flex-col items-center justify-center bg-white/5 border-2 border-white/20 p-10 rounded-lg backdrop-blur-sm">
            <span className="text-gray-400 text-sm uppercase tracking-tighter mb-2">Total Score</span>
            <h2 
              style={{fontFamily: '"gameboy", "Courier New", Courier, monospace'}}
              className="text-6xl sm:text-8xl md:text-9xl text-yellow-400 drop-shadow-[0_0_10px_#eab308]"
            >
              {score}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <MainButton title="Play Again" func={handlePlayAgain} />
            <MainButton title="Leaderboard" func={() => navigate('/Leaderboard')} />
            <MainButton title="Main Menu" func={() => navigate('/')} />
          </div>
          
        </div>
      </div>
    </>
  );
}