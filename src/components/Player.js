import React from "react"

function Player({ x, y }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "50px",
        height: "50px",
        backgroundColor: "red"
      }}
    ></div>
  );
}

export default Player;