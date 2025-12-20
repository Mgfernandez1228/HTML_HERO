import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './website.css'

import Home from './Web_Pages/Home.jsx'
import Login from './Web_Pages/Login.jsx'

import Title from './Web_Pages/Title.jsx'
import Leaderboard from './Web_Pages/Leaderboard.jsx';

export default function App() {
return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />


        <Route path="/Title" element={<Title />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}
