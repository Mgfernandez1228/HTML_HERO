import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './website.css'

import Home from './Web_Pages/Home.jsx'
import Leaderboard from './Web_Pages/Leaderboard.jsx';

export default function App() {
return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}
