import React from 'react'

const MainButton = ({title, func}) => {
  return (
    <button onClick={func ? func : undefined} className='bg-gray-800 text-white border-2 border-gray-500
    p-4 px-24 text-6xl rounded-2xl transition-transform duration-300 hover:text-cyan-300 hover:bg-gray-700 hover:scale-110 hover:shadow-[0_0px_20px_#00ffff] '>{title}</button>
  )
}

export default MainButton