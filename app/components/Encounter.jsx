import React from 'react'

const Encounter = ({player, enemy}) => {
    
  return (
    <div className='fixed inset-0 bg-black/30  flex items-center justify-center z-50'> 
        <div className='bg-white text-black p-8 rounded-2xl border-4 border-gray-700 shadow-2xl flex flex-col items-center justify-center'>
            <h4>Fix me!</h4>
            <p id="code" className="broken"></p>
            <form className="flex flex-col gap-4" id="fix-code-1">
                <div className='flex flex-row justify-center items-center gap-2'>
                    <label htmlFor="line-1">Line 1:</label>
                    <textarea className="line" id="line-1" rows="1" cols="50"></textarea>
                </div>
                
                <div className='flex flex-row justify-center items-center gap-2'>
                    <label htmlFor="line-2">Line 2:</label>
                    <textarea className="line" id="line-2" rows="1" cols="50"></textarea>
                </div>

                <div className='flex flex-row justify-center items-center gap-2'>
                    <label htmlFor="line-3">Line 3:</label>
                    <textarea className="line" id="line-3" rows="1" cols="50"></textarea>
                </div>

                <div className='flex flex-row justify-center items-center gap-2'>
                    <label htmlFor="line-4">Line 4:</label>
                    <textarea className="line" id="line-4" rows="1" cols="50"></textarea>
                </div>
            </form>

            <p id="output-1"> </p>
        </div>
        
    </div>
  )
}

export default Encounter