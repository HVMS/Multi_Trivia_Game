import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GameCreatePage from './components/Games/createGame';
import HomePage from './components/HomePage';
import AdminBase from './components/AdminBase';
import QuestionBase from './components/Questions/QuestionBase';
import GameLobby from './components/game-lobby';
import Header from './components/header';
import { ToastContainer } from 'react-toastify';
import PlayGamePage from './components/game_experience/gamePage';
import Temp from './components/game_experience/temp';
import Wait from './components/game-lobby/wait';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './components/profile-management/Profile'
import Login from './components/Authentication/LoginPage';
import Registration from './components/Authentication/RegestrationPage';
import { useSelector } from "react-redux";
import SecurityQuestionPage from './components/Authentication/SecurityQuestionPage';
import { selectUser } from './redux/userSlice';
import TeamStats from './components/Team_management/team_stats';
import ManageTeam from './components/Team_management/manage_team';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWebSocket from 'react-use-websocket';
import Leaderboard from './components/Leaderboard/Leaderboard';

export const App = () => {
  const isAuth = useSelector(selectUser);
  const notify = (message: any) => toast.success(message);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket("wss://0rs2czib7e.execute-api.us-east-1.amazonaws.com/production", {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      if (data.output !== undefined || data.output !== "") {
        notify(data.output);
      }
    }
  });

  useEffect(() => {
    sendMessage(JSON.stringify({ "action": "getNotifications" }));
  })
  return (
    <Router>
      <div className="App">
        {isAuth && (<Header />)}
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/game-lobby" /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to="/game-lobby" /> : <Registration />} />
          <Route path="/security-questions" element={isAuth ? <Navigate to="/game-lobby" /> : <SecurityQuestionPage />} />
          {isAuth && (
            <>
              <Route path="/questions" element={<QuestionBase />} />
              <Route path="/admin" element={<AdminBase />} />
              <Route path="/createGame" element={<GameCreatePage />} />
              <Route path='/game-lobby' element={<GameLobby />} />
              <Route path="/playGame" element={<PlayGamePage />} />
              <Route path="/gaming_experience" element={<Temp />} />
              <Route path="/game-lobby/wait" element={<Wait />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/team-stats" element={<TeamStats />} />
              <Route path="/manage-team" element={<ManageTeam />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-left"
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