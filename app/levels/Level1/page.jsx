"use client"
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import NPC from '../../components/NPC';
import Player from '../../components/Player';
import Encounter from '../../components/Encounter';

const checkCollision = (player, NPC) => {
  return !(
    player.x + 90 < NPC.x || // left
    player.x > NPC.x + 90 || // right
    player.y + 50 < NPC.y || // above
    player.y > NPC.y + 50    // below
  );
};

const page = () => {
  const worldRef = useRef(null);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50, i_color: "lightgreen", sprite_text: "<hero>" });
  const [enemyPos] = useState({ x: 600, y: 500, n_color: "darkred",sprite_text: "<HtMML>"  }); // enemy position
  const [NPCPos] = useState({ x: 350, y: 100, n_color: "darkblue", sprite_text: "<NPC>"  }); // Npc position

  const [encounter, setEncounter] = useState(false);

 useEffect(() => {
  const keysPressed = {};

  const handleKeyDown = (e) => { keysPressed[e.key] = true; };
  const handleKeyUp = (e) => { keysPressed[e.key] = false; };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  const movePlayer = () => {
    setPlayerPos(prev => {
      let x = prev.x;
      let y = prev.y;
      let i_color = prev.i_color;
      let sprite_text = prev.sprite_text;

      const step = 0.5;//speed of player
      const world = worldRef.current;
      const worldWidth = world.clientWidth;
      const worldHeight = world.clientHeight;

      if (keysPressed["ArrowUp"]) y -= step;
      if (keysPressed["ArrowDown"]) y += step;
      if (keysPressed["ArrowLeft"]) x -= step;
      if (keysPressed["ArrowRight"]) x += step;

      //keep player inside world boundaries
      x = Math.max(0, Math.min(x, worldWidth - 100));
      y = Math.max(0, Math.min(y, worldHeight - 50));

      if (checkCollision({ x, y }, enemyPos)) {
        setEncounter(true);
        x = prev.x;
        y = prev.y;
      }
      if (checkCollision({ x, y }, NPCPos)) {
        
        x = prev.x
        y = prev.y
      }

      return { x, y, i_color, sprite_text };
    });

    requestAnimationFrame(movePlayer); //looping for smoothness
  };

  movePlayer();

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}, [enemyPos, NPCPos]);

  return (
  <div className='bg-black w-screen'>
    <div className='flex justify-center items-center h-screen'>
        <div
            ref={worldRef}
            className="bg-gray-900 relative w-[1000px] h-[800px] border-4 border-lime-500 overflow-hidden">
            <Player x={playerPos.x} y={playerPos.y} i_color={playerPos.i_color} sprite_text={playerPos.sprite_text} />
            <NPC x={enemyPos.x} y={enemyPos.y} n_color={enemyPos.n_color} sprite_text={enemyPos.sprite_text} />
            <NPC x={NPCPos.x} y={NPCPos.y} n_color={NPCPos.n_color} sprite_text={NPCPos.sprite_text} />
        </div>
        {encounter && <Encounter/>}
    </div>
  </div>
    
  )
}

export default page