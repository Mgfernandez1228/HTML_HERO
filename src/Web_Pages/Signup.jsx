import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NotUIReactComponents/Navbar';

export default function Signup() {
  const navigate = useNavigate();
  
  // 1. State to capture input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const themeFont = {
    fontFamily: '"gameboy", "Courier New", Courier, monospace'
  };

  // 2. Integration Logic
  const handleSignin = async (e) => {
    e.preventDefault(); // Prevents page reload
    setError('');

    try {
      // Points to your Express backend on port 5000
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the session token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        // Success! Redirect to the Title screen
        alert("Registered! Please Sign In.");
        navigate('/Login');
      } else {
        // Display the specific error from your backend (e.g., "User not found")
        setError(data.error || 'Authentication Failed');
      }
    } catch (err) {
      setError('Could not connect to the auth server.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen w-full bg-black px-4">
        <div className="relative w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-xl border-2 border-cyan-500 rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.2)]">
          
          <div className="text-center mb-10">
            <h2 style={themeFont} className="text-3xl text-white drop-shadow-[0_0_1px_#00ffff] mb-2">
              SIGNUP <span className="text-cyan-400">AUTH</span>
            </h2>
            <p style={themeFont} className={`text-[10px] tracking-widest uppercase ${error ? 'text-red-500' : 'text-cyan-500/60'}`}>
              {error ? error : 'Identify yourself, Hero'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSignin}>
            <div>
              <label style={themeFont} className="block text-[12px] text-cyan-400 mb-2 uppercase ml-1">
                Username
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER NAME..."
                style={themeFont}
                className="w-full bg-black border-b-2 border-gray-700 text-white p-3 outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                style={themeFont}
                className="w-full bg-black border-b-2 border-gray-700 text-white p-3 outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600"
              />
            </div>

            <div className="pt-4 space-y-4">
              <button 
                type="submit"
                style={themeFont}
                className="w-full bg-cyan-500 hover:bg-white text-black font-bold py-4 rounded-sm transition-all border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 text-lg"
              >
                SIGN IN
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/')}
                style={themeFont}
                className="w-full text-gray-500 hover:text-cyan-400 text-[10px] transition-colors uppercase tracking-widest"
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