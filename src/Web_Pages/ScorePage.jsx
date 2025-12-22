import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainButton from "../NotUIReactComponents/MainButton.jsx";

export default function ScorePage() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [syncStatus, setSyncStatus] = useState(""); // Optional: To show saving status

  useEffect(() => {
    // 1. Grab everything from localStorage
    const savedScore = localStorage.getItem("gameScore");
    const userID = localStorage.getItem("userID");
    const token = localStorage.getItem('token');

    if (savedScore) {
      // 2. Update the UI state immediately
      const numericScore = parseInt(savedScore);
      setScore(numericScore);

      // 3. Trigger the backend sync if we have a user logged in
      if (userID && token) {
        saveScoreToBackend(userID, numericScore, token);
      } else {
        console.warn("Score found, but no User ID or Token detected. Playing as Guest?");
      }
    }
  }, []);

const saveScoreToBackend = async (id, finalScore, token) => {
  try {
    // Ensure the ID is a valid string before sending
    if (!id || id === "undefined") {
      console.error("No valid User ID found");
      return;
    }

    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT', // Matches your backend app.put
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        score: parseInt(finalScore) // Backend expects 'score'
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Score updated in MongoDB successfully!");
    } else {
      console.error("Backend error:", data.error);
    }
  } catch (error) {
    console.error("Network error connecting to backend:", error);
  }
};

  const handlePlayAgain = () => {
    localStorage.removeItem("gameScore");
    navigate('/Title');
    window.location.reload(); 
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black animate-gradient text-white px-4 sm:px-8">
        <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-16 lg:gap-20">
          
          <div className="flex flex-col items-center gap-4">
            <h1 
              style={{fontFamily: '"gameboy", "Courier New", Courier, monospace'}} 
              className="font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white 
                        drop-shadow-[0_0_5px_#ff00ff] 
                        [text-shadow:3px_5px_0px_#1a1a1a,6px_8px_15px_rgba(0,0,0,0.7)] 
                        breathe text-center"
            >
              You WIN!!!
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/5 border-2 border-white/20 p-10 rounded-lg backdrop-blur-sm">
            <span className="text-gray-400 text-sm uppercase tracking-tighter mb-2">Total Score</span>
            <h2 
              style={{fontFamily: '"gameboy", "Courier New", Courier, monospace'}}
              className="text-6xl sm:text-8xl md:text-9xl text-yellow-400 drop-shadow-[0_0_10px_#eab308]"
            >
              {score.toString().padStart(6, '0')}
            </h2>
            {/* Display the sync status beneath the score */}
            <p className="mt-4 text-xs font-mono text-gray-500 uppercase">{syncStatus}</p>
          </div>

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