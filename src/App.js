import logo from './logo.svg';
import './App.css';
import Player from './components/Player.js'
import { useState } from 'react';
import {useEffect} from 'react';

function App() {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerPos(prev => {
        let x = prev.x;
        let y = prev.y;
        if (e.key === "ArrowUp") y -= 10;
        if (e.key === "ArrowDown") y += 10;
        if (e.key === "ArrowLeft") x -= 10;
        if (e.key === "ArrowRight") x += 10;
        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div style={{ position: "relative", width: "400px", height: "400px", border: "1px solid black" }}>
      <Player x={playerPos.x} y={playerPos.y} />
    </div>
  );
}





export default App;