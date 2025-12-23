import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NotUIReactComponents/Navbar';

export default function Signup() {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const themeFont = {
    fontFamily: '"gameboy", "Courier New", Courier, monospace'
  };

  // --- NEW VALIDATION LOGIC ---
  const validateSignup = () => {
    if (username.length < 3) {
      setError('USERNAME TOO SHORT, USE AT LEAST 3 LETTERS');
      return false;
    }
    if (username.includes(' ')) {
      setError('NO SPACES ALLOWED IN USERNAME');
      return false;
    }
    if (password.length < 6) {
      setError('PASSWORD TOO SHORT, USE AT LEAST 6 LETTERS');
      return false;
    }
    return true;
  };

  const handleSignin = async (e) => {
    e.preventDefault(); 
    setError('');

    // 1. Run validation before calling the server
    if (!validateSignup()) return;

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("HERO REGISTERED! PROCEED TO LOGIN.");
        navigate('/Login');
      } else {
        setError(data.error || 'IDENTIFICATION FAILED');
      }
    } catch (err) {
      setError('COULD NOT CONNECT TO AUTH SERVER.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen w-full bg-black px-4">
        <div className="relative w-full max-w-sm md:max-w-md p-6 md:p-8 bg-gray-900/80 backdrop-blur-xl border-2 border-cyan-500 rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.2)]">
          
          <div className="text-center mb-8 md:mb-10">
            <h2 style={themeFont} className="text-2xl md:text-3xl text-white drop-shadow-[0_0_1px_#00ffff] mb-2">
              SIGNUP <span className="text-cyan-400">AUTH</span>
            </h2>
            {/* Visual Feedback: Background changes when error exists */}
            <p style={themeFont} className={`text-[10px] tracking-widest uppercase py-1 border transition-all ${error ? 'text-red-500 border-red-500 bg-red-500/10' : 'text-cyan-500/60 border-transparent'}`}>
              {error ? error : 'Identify yourself, Hero'}
            </p>
          </div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSignin} noValidate={false}>
            <div>
              <label style={themeFont} className="block text-[12px] text-cyan-400 mb-2 uppercase ml-1">
                Username
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                placeholder="ENTER NAME..."
                style={themeFont}
                /* Border turns red if username validation fails */
                className={`w-full bg-black border-b-2 p-3 outline-none transition-colors placeholder:text-gray-600 text-white ${error.includes('USERNAME') ? 'border-red-500' : 'border-gray-700 focus:border-cyan-400'}`}
              />
            </div>

            <div>
              <label style={themeFont} className="block text-[12px] text-cyan-400 mb-2 uppercase ml-1">
                Password
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                placeholder="********"
                style={themeFont}
                /* Border turns red if password validation fails */
                className={`w-full bg-black border-b-2 p-3 outline-none transition-colors placeholder:text-gray-600 text-white ${error.includes('PASSWORD') ? 'border-red-500' : 'border-gray-700 focus:border-cyan-400'}`}
              />
            </div>

            <div className="pt-4 space-y-4">
              <button 
                type="submit"
                style={themeFont}
                className="w-full bg-cyan-500 hover:bg-white text-black font-bold py-3 md:py-4 rounded-sm transition-all border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 text-base md:text-lg"
              >
                CREATE ACCOUNT
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/')}
                style={themeFont}
                className="w-full text-gray-500 hover:text-cyan-400 text-[9px] md:text-[10px] transition-colors uppercase tracking-widest"
              >
                [ Return to Home ]
              </button>
            </div>
          </form>

          <div className="absolute top-[-2px] left-[-2px] w-4 h-4 border-t-2 border-l-2 border-white"></div>
          <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 border-b-2 border-r-2 border-white"></div>
        </div>
      </div>
    </>
  );
}