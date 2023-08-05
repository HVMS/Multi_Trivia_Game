import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card';
interface comparedata {
    email: string;
    contact: string;
    name: string;
    games: string;
    points: string;
    wins: string;
    losses: string;
    teams: string[];
}

interface Team {

  TeamName: string;

  GamesPlayed: number;

  WinCount: number;

  LossCount: number;

  TotalPoints: number;
}
export default function Leaderboard() {
  const [lead, setLead]=useState<comparedata[]>([]);
  const [teams,setTeam]=useState<any[]>([]);
  const [btype, setbtype]=useState("team")
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setbtype(event.target.value);
  };
  useEffect(()=>{
    axios.post("https://us-east1-celtic-origin-387216.cloudfunctions.net/comparePlayers", { email: ' ' })
    .then((resp) => {
        console.log("data received")
        resp.data.sort((a: { points: string; }, b: { points: string; }) => parseInt(b.points) - parseInt(a.points));
        console.log(resp.data)
        setLead(resp.data);
    })
    .catch((error) => {
        console.log("Error fetching comparison data:", error);
    });
    axios.post("https://k4ru2wkr7a.execute-api.us-east-1.amazonaws.com/prod/fetchallteamstats")
    .then((resp) => {
      console.log("data received")
      console.log(JSON.parse(resp.data.body))
      resp.data.body.sort((a: { totalPoints: string; }, b: { totalPoints: string; }) => parseInt(b.totalPoints) - parseInt(a.totalPoints));
      setTeam(JSON.parse(resp.data.body));
  })
  .catch((error) => {
      console.log("Error fetching comparison data:", error);
  });
  },[]);
  let currentIndex=1;
  return (
    <>
      <label>Choose a leaderboard type: </label>
      <select name="board" id="board" onChange={handleSelectChange}>
        <option value="Individual">Individual</option>
        <option value="Team">Team</option>
      </select>
    
        <div>
     {btype=="Individual" ? (
    lead.map((user, currentIndex) => ( 
      <div key={currentIndex}>
        <Card>
          <Card.Title>Name: {user?.name}</Card.Title>
          <Card.Body>
                            <div className="container customer-profile my-4">
                                <div className="row mb-2 profile-item">
                                <div className="col-lg-12">
                                        <h4 className="d-inline">Position : {currentIndex}</h4>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Teams:{user?.teams.map((team) => <>{team} <br /></>)}</h4>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Points : {user?.points}</h4>
                                        <hr></hr>
                                    </div>
                                </div>
                                <div className="row mb-2 profile-item">
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">W/L : {user?.wins} / {user?.losses}</h4>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Games Played : {user?.games}</h4>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
        </Card>
        <br />
      </div>
    ))
  ) :(
    teams.map((team, currentIndex) => ( 
      <div key={currentIndex}>
        <Card>
          <Card.Title>Name: {team?.TeamID?.S}</Card.Title>
          <Card.Body>
                            <div className="container customer-profile my-4">
                                <div className="row mb-2 profile-item">
                                <div className="col-lg-12">
                                        <h4 className="d-inline">Position : {currentIndex}</h4>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Points : {team?.TotalPoints?.N}</h4>
                                        <hr></hr>
                                    </div>
                                </div>
                                <div className="row mb-2 profile-item">
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">W/L : {team?.Wins?.N} / {team?.Losses?.N}</h4>
                                        <hr></hr>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="d-inline">Games Played : {team?.GamesPlayed?.N}</h4>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
        </Card>
        <br />
      </div>
    ))
  )}
</div>
    </>
  )
}
