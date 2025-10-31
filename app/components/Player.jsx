import React from 'react'

const Player = ({x, y}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "50px",
        height: "50px",
        backgroundColor: "blue"
      }}
    ></div>
  )
}

export default Player