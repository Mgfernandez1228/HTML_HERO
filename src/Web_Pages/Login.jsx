import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../NotUIReactComponents/Navbar';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  
  // 1. State for user credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const themeFont = {
    fontFamily: '"gameboy", "Courier New", Courier, monospace'
  };

  // 2. The Login Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Points to your Express backend login route on port 3000
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token and user info in the browser
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userID', data._id);

        // 2. Update App State (The check prevents the error)
        if (typeof setUser === 'function') {
            setUser({ username: data.username, token: data.token });
        }
        
        // Success! Enter the game
        navigate('/Title');
      } else {
        // Display error (e.g., "Invalid credentials" or "User not found")
        setError(data.error || 'Login Failed');
      }
    } catch (err) {
      setError('Terminal connection offline.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen w-full bg-black px-4">
        <div className="relative w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-xl border-2 border-indigo-500 rounded-lg shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          
          <div className="text-center mb-10">
            <h2 style={themeFont} className="text-3xl text-white drop-shadow-[0_0_1px_#6366f1] mb-2">
              LOGIN <span className="text-indigo-400">SESSION</span>
            </h2>
            <p style={themeFont} className={`text-[10px] tracking-widest uppercase ${error ? 'text-red-500' : 'text-indigo-500/60'}`}>
              {error ? error : 'Enter credentials to proceed'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label style={themeFont} className="block text-[12px] text-indigo-400 mb-2 uppercase ml-1">
                Username
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                placeholder="PLAYER_NAME"
                style={themeFont}
                className="w-full bg-black border-b-2 border-gray-700 text-white p-3 outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-700"
              />
            </div>

            <div>
              <label style={themeFont} className="block text-[12px] text-indigo-400 mb-2 uppercase ml-1">
                Password
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                placeholder="********"
                style={themeFont}
                className="w-full bg-black border-b-2 border-gray-700 text-white p-3 outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-700"
              />
            </div>

            <div className="pt-4 space-y-4">
              <button 
                type="submit"
                style={themeFont}
                className="w-full bg-indigo-600 hover:bg-white text-black font-bold py-4 rounded-sm transition-all border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 text-lg"
              >
                LOGIN
              </button>
              
              <Link 
                to="/Signup"
                style={themeFont}
                className="block text-center text-gray-500 hover:text-indigo-400 text-[10px] transition-colors uppercase tracking-widest"
              >
                No account? Create one here
              </Link>
            </div>
          </form>

          {/* Decorative accents */}
          <div className="absolute top-[-2px] left-[-2px] w-4 h-4 border-t-2 border-l-2 border-indigo-400"></div>
          <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 border-b-2 border-r-2 border-indigo-400"></div>
        </div>
      </div>
    </>
  );
}