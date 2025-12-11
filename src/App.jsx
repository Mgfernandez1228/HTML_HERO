import { startGame } from './main.jsx';
import './website.css'


export default function App() {
  return (
<div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center space-y-6">
  <h1 className="text-5xl font-bold text-blue-700 drop-shadow-sm">
    My Website
  </h1>

  <button
    onClick={startGame}
    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200"
  >
    Play
  </button>
</div>

  );
}
