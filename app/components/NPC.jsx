import React from 'react'

const NPC = ({x, y, n_color, sprite_text}) => {
  return (
    <div className="NPC" style={{ 
        position: "absolute",
        left: x,
        top: y,
        fontSize: "24px",          //size of the <hero>
        fontWeight: "bold",
        color: n_color,            // color of the text
        userSelect: "none",       
        pointerEvents: "none",     
     }}>
      {sprite_text}
     </div>
  )
}

export default NPC