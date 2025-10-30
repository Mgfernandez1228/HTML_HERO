import React from "react"

function Player({ x, y }) {
  return (
    <div Player_Style
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "50px",
        height: "50px",
        backgroundColor: "blue"
      }}
    ></div>
  );
}

export default Player;