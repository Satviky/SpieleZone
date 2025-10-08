import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.module.css';

// Layout Components
import Navbar from './components/layout/Navbar.jsx';
import BBar from './components/layout/BottomBar.jsx';
import DonateButton from './components/Donate.jsx';

// Pages
import Homepg from './components/pages/HomePage.jsx';
import AboutUs from './components/pages/AboutPage.jsx';
import CU from './components/pages/ContactPage.jsx';
import Prpo from './components/PrivacyPolicy.jsx';
import Home2 from './components/pages/home2.jsx'


// Extras
import GCintro from './components/games/ghost-code/GhostCodeIntro.jsx';

// Games
import Game2048 from './components/games/game-2048/Game2048.jsx';
import SnakeGame from './components/games/snake/SnakeGame.jsx';
import Hangman from './components/games/hangman/Hangman.jsx';
import GCplay from './components/games/ghost-code/GhostCode.jsx';
import MemoryPuzzle from './components/games/MemoryPuzzle/Memory.jsx';
import BounceGame from './components/games/bounce/bounce.jsx';
import NeonDodge3D from './components/games/neondodge/neondodge.jsx';

// Optional: 404 Page (to catch unmatched routes)
const NotFound = () => (
  <div className="text-center text-white py-20 text-2xl">
    404 - Page Not Found
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        
        <div className="main-content">
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Homepg />} />
            <Route path="/home" element={<Home2 />} />

            {/* Game intros */}
            <Route path="/ghost-code" element={<GCintro />} />

            {/* Games */}
            <Route path="/tzfe" element={<Game2048 />} />
            <Route path="/Snake" element={<SnakeGame />} />
            <Route path="/HangMan" element={<Hangman />} />
            <Route path="/ghost-code/play" element={<GCplay />} />
            <Route path="/memory" element={<MemoryPuzzle />} />
            <Route path="/bounce" element={<BounceGame />} />
            <Route path="/NeonDodge3D" element={<NeonDodge3D />} />

            {/* Other pages */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/reach-us" element={<CU />} />
            <Route path="/privacy-policy" element={<Prpo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <DonateButton />
        </div>

        <BBar />
      </div>
    </Router>
  );
}

export default App;