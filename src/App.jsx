import React, { useState, useEffect } from 'react'; // Added Hooks
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './website.css';

import Home from './Web_Pages/Home.jsx';
import Login from './Web_Pages/Login.jsx';
import Signup from './Web_Pages/Signup.jsx';
import About from './Web_Pages/About.jsx';
import ScorePage from './Web_Pages/ScorePage.jsx';

import Title from './Web_Pages/Title.jsx'
import Leaderboard from './Web_Pages/Leaderboard.jsx';

export default function App() {
  // 1. Initialize user state
  const [user, setUser] = useState(null);

  // 2. Persistence Check: Runs once when the app starts
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (savedToken && savedUsername) {
      // The site "remembers" the user from the last session
      setUser({ username: savedUsername, token: savedToken });
    }
  }, []);

  // 3. Security Gate (Protected Route)
  // This prevents non-logged-in users from manually typing "/Title"
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/Login" replace />;
    }
    return children;
  };



  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        {/* We pass setUser to Login so it can update the App's memory immediately */}
        <Route path="/Login" element={<Login setUser={setUser} />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/About" element={<About />} />

        {/* Protected Game Routes */}
        <Route 
          path="/Title" 
          element={
            <ProtectedRoute>
              <Title user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Leaderboard" 
          element={
            <ProtectedRoute>
              <Leaderboard user={user} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ScorePage" 
          element={
            <ProtectedRoute>
              <ScorePage user={user} />
            </ProtectedRoute>
          } 
        />


      </Routes>
    </BrowserRouter>
  );
}