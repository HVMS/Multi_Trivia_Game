import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameCreatePage from './components/Games/createGame';
import HomePage from './components/HomePage';
import AdminBase from './components/AdminBase';
import QuestionBase from './components/Questions/QuestionBase';
import GameLobby from './components/game-lobby';
import Header from './components/header';
import { ToastContainer } from 'react-toastify';
import PlayGamePage from './components/game_experience/gamePage';
import Temp from './components/game_experience/temp';

interface GameData {
  game_name: string;
  game_difficulty_level: string;
  game_timeframe: number;
  userEmail: string;
  team_name: string;
}

export const App = () => {
  
  const [gameData, setGameData] = useState<GameData>({game_name: 'Game 4',
  game_difficulty_level: 'Easy',
  game_timeframe: 200,
  userEmail: 'test5gmail.com',
  team_name: 'Team 4',
}); // Initialize with an empty object

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionBase />} />
          <Route path="/admin" element={<AdminBase />} />
          <Route path="/createGame" element={<GameCreatePage />} />
          <Route path='/game-lobby' element={<GameLobby />} />
          <Route path="/playGame" element={<PlayGamePage/>} />
          <Route path="/gaming_experience/:userEmail" element={<Temp gameData={gameData}/>} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
    </Router>
  );
}