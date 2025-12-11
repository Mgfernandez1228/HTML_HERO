import { startGame } from '../main.jsx';
import MainButton from "../NotUIReactComponents/MainButton.jsx"

export default function Home(){
    
return (
  <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black animate-gradient text-white px-4 sm:px-8">
    <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-16 lg:gap-20">
      <h1 className="font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-9xl text-white 
                      drop-shadow-[0_0_25px_#00ffff] 
                      [text-shadow:3px_5px_0px_#1a1a1a,6px_8px_15px_rgba(0,0,0,0.7)] 
                      breathe text-center">
        HTML HERO
      </h1>
      <div className="flex flex-col gap-4 sm:gap-6">
        <MainButton title="Start Game" func={startGame} />
        <MainButton title="Leaderboard" func={() => console.log("Leaderboard")} />
        <MainButton title="Settings" func={() => console.log("Settings")} />
      </div>
    </div>
  </div>
);

}

//         <div className="min-h-screen bg-blue-500 flex flex-col items-center justify-center space-y-6">
//   <h1 className="text-5xl font-bold text-blue-700 drop-shadow-sm">
//     My Website
//   </h1>

//   <button
//     onClick={startGame}
//     className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200"
//   >
//     Play
//   </button>
// </div>