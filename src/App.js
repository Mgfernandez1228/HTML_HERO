import './App.css';
import Player from './components/Player.js';
import NPC from './components/NPC.js';
import { useState, useEffect, useRef } from 'react';

// Collision helper function
const checkCollision = (player, enemy) => {
  return !(
    player.x + 50 < enemy.x || // Player right < Enemy left
    player.x > enemy.x + 50 || // Player left > Enemy right
    player.y + 50 < enemy.y || // Player bottom < Enemy top
    player.y > enemy.y + 50    // Player top > Enemy bottom
  );
};

function App() {
  const worldRef = useRef(null);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 200 });
  const [enemyPos, setEnemyPos] = useState({ x: 300, y: 200 }); // enemy position
  const [NPCPos, setNPCPos] = useState({ x: 300, y: 400 }); // enemy position

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerPos(prev => {
        let x = prev.x;
        let y = prev.y;

        const step = 10; // movement step
        const world = worldRef.current;
        const worldWidth = world.clientWidth;
        const worldHeight = world.clientHeight;

        if (e.key === "ArrowUp") y -= step;
        if (e.key === "ArrowDown") y += step;
        if (e.key === "ArrowLeft") x -= step;
        if (e.key === "ArrowRight") x += step;

        // Clamp player inside world boundaries
        x = Math.max(0, Math.min(x, worldWidth - 50));
        y = Math.max(0, Math.min(y, worldHeight - 50));

        // Collision with NPC
        if (checkCollision({ x, y }, enemyPos)) {
          console.log("Collision!");
          alert("Start Battle")
          x = prev.x;
          y = prev.y;
        }

        if (checkCollision({ x, y }, NPCPos)) {
          console.log("Collision!");
          alert("Start dialouge")
          x = prev.x;
          y = prev.y;
        }

        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enemyPos]);

  return (
    <div
      className="World_1"
      ref={worldRef}
      style={{
        position: 'relative',
        width: '800px',   // fixed size world
        height: '600px',
        border: '3px solid black', // visible border
        margin: '50px auto',       // center on page
        overflow: 'hidden'         // ensure nothing escapes
      }}
    >
      <Player x={playerPos.x} y={playerPos.y} />
      <NPC x={enemyPos.x} y={enemyPos.y} />
      <NPC x={NPCPos.x} y={NPCPos.y} />
    </div>
  );
}

export default App;
