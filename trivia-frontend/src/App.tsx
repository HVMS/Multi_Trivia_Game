import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameCreatePage from './components/Games/createGame';
import HomePage from './components/HomePage';
import AdminBase from './components/AdminBase';
import QuestionBase from './components/Questions/QuestionBase';
import PlayGamePage from './components/game_experience/gamePage';

export const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/questions" element={<QuestionBase/>} />
          <Route path="/admin" element={<AdminBase/>}/>
          <Route path="/createGame" element={<GameCreatePage/>} />
          <Route path="/playGame" element={<PlayGamePage/>} />
        </Routes>
      </div>
    </Router>
  );
}