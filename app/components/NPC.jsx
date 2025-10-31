import React from 'react'

const NPC = ({x, y}) => {
  return (
    <div className="NPC" style={{ 
        position: "absolute",
        left: x,
        top: y,
        width: "50px",
        height: "50px",
        backgroundColor: "red",
     }}></div>
  )
}

export default NPC