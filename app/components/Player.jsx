import React from 'react';

const Player = ({ x, y, i_color, sprite_text }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: "24px",          // size of the "<hero>" text
        fontWeight: "bold",
        color: i_color,            // color of the text
        userSelect: "none",        // prevent text selection
        pointerEvents: "none",     // allow clicks/keys to pass through
      }}
    >
      {sprite_text}
    </div>
  );
};

export default Player;
