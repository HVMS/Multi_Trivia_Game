import React from 'react';
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
import TeamStats from './components/Team_management/team_stats';
import ManageTeam from './components/Team_management/manage_team';
import Register from './components/User_Registration/register';

export const App = () => {
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
          <Route path="/gaming_experience" element={<Temp/>} />
          <Route path="/team-stats" element={<TeamStats/>} />
          <Route path="/manage-team" element={<ManageTeam/>} />
          <Route path="/register" element={<Register/>} />
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