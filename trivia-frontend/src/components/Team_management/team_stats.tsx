import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/teamStats.css'


interface Team {
  teamName: string;
  gamesPlayed: number;
  winCount: number;
  lossCount: number;
  totalPoints: number;
}

function TeamStats() {
  let [gamesPlayed, setGamesPlayed] = useState(0);
  let [winCount, setWinCount] = useState(0);
  let [lossCount, setLossCount] = useState(0);
  let [totalPoints, setTotalPoints] = useState(0);
  let [teamMembers, setTeamMembers] = useState([]);
  let [teamName, setTeamName] = useState('');
  let [teams, setTeams] = useState<Team[]>([]);

  const navigate = useNavigate();

  const user = localStorage.getItem('email');
  const fetchTeamNames = async (user: string | null) => {
    console.log(user);
    fetch('https://k4ru2wkr7a.execute-api.us-east-1.amazonaws.com/prod/fetchTeamNames', {
      method: 'POST',
      body: JSON.stringify({
        'email': user,
      }),
    }).then((response) => {
      return response.json();
    })
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          setTeams(data);
        }
      }).catch((error) => {
        console.error('Error:', error);
      });
  };


  const fetchDataFromDynamoDB = async (team: string) => {
    fetch('https://k4ru2wkr7a.execute-api.us-east-1.amazonaws.com/prod/fetchdatafromdb', {
      method: 'POST',
      body: JSON.stringify({
        'team': team,
      }),
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setTeamName(data.TeamID['S']);
      setGamesPlayed(data.GamesPlayed['N']);
      setWinCount(data.Wins['N']);

      setLossCount(data.Losses['N']);
      setTotalPoints(data.TotalPoints['N']);

    }).catch((error) => {
      console.error('Error:', error);
    });
  };


  const fetchTeamMembersFromDynamoDB = async (teamName: string | undefined) => {
    console.log(teamName);
    fetch('https://k4ru2wkr7a.execute-api.us-east-1.amazonaws.com/prod/fetchteammembers', {
      method: 'POST',
      body: JSON.stringify({
        'team': teamName,
      }),
    }).then((response) => {
      return response.json();
    })
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          setTeamMembers(data);
        }
      }).catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    // fetchTeamMembersFromDynamoDB(teamName);
    fetchTeamNames(user);
  }, []);

  useEffect(() => {
    const chosenTeam = teams.find((team) => team.teamName === teamName);
    console.log(chosenTeam);
    console.log(teams);
    if (chosenTeam) {
      setGamesPlayed(chosenTeam.gamesPlayed);
      setWinCount(chosenTeam.winCount);
      setLossCount(chosenTeam.lossCount);
      setTotalPoints(chosenTeam.totalPoints);
    }
  }, [teamName, teams]);

  const handleAddGame = () => {
    fetch('https://n39biejcka.execute-api.us-east-1.amazonaws.com/prod/increment',
      {
        method: 'POST',
        body: JSON.stringify({
          'team': teamName,
          'Add_To_Attribute': 'Games Played',
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(gamesPlayed);
        //type of gamesPlayed
        console.log(typeof (gamesPlayed));
        //convert to number
        setGamesPlayed(Number(gamesPlayed) + 1);
      })
      .catch((error) => {
        console.error('Error adding win to DynamoDB', error);
      });
  };

  const handleAddWin = () => {
    fetch('https://n39biejcka.execute-api.us-east-1.amazonaws.com/prod/increment',
      {
        method: 'POST',
        body: JSON.stringify({
          'team': teamName,
          'Add_To_Attribute': 'Wins',
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setWinCount(Number(winCount) + 1);
      })
      .catch((error) => {
        console.error('Error adding win to DynamoDB', error);
      });
  };

  const handleAddLoss = () => {
    fetch('https://n39biejcka.execute-api.us-east-1.amazonaws.com/prod/increment',
      {
        method: 'POST',
        body: JSON.stringify({
          'team': teamName,
          'Add_To_Attribute': 'Losses',
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLossCount(Number(lossCount) + 1);
      })
      .catch((error) => {
        console.error('Error adding win to DynamoDB', error);
      });
  };

  const handleAddPoints = (points: number) => {
    //TODO
    setTotalPoints(totalPoints + points);
  };

  const handleLeaveTeam = (member: string | null) => {
    var values = {
      "team": teamName,
      "email": member
    };

    fetch(' https://5796bzmorl.execute-api.us-east-1.amazonaws.com/prod/remove-player', {
      method: 'POST',
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.statusCode == 200) {
          alert('Member Removed');
          window.location.reload();
        }
        else if (data.statusCode == 404) {
          if (data.body == "User with email Admin not found in the DynamoDB item.")
            alert('Member Not Found');
          else if (data.body == "Item not found in the DynamoDB table.")
            alert('Team Not Found');

        }
        else {
          console.error('Error:', data);
          alert('Error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error');
      });

  };

  function selectTeam(teamName: string): void {

    //   fetchTeamMembersFromDynamoDB(teamName);
    setTeamName(teamName);
    console.log(teamName);
    fetchDataFromDynamoDB(teamName);
    fetchTeamMembersFromDynamoDB(teamName);
  }

  const leaveTeam = () => {
confirm('Are you sure you want to leave this team?') && handleLeaveTeam(user);
  }
  // https://n39biejcka.execute-api.us-east-1.amazonaws.com/prod/increment add game wins losses api // to be called when user starts and finishes a game
  return (
    <div className="team-stats">
      <div>
        <h2>
          Team Statistics: {teamName}
        </h2>
        <p>Games Played: {gamesPlayed}</p>
        <p>
          Win/Loss Ratio: {winCount}/{lossCount}
        </p>
        <p>Total Points Earned: {totalPoints}</p>
      </div>
      <div className='white-line'> </div>
        
      <h2>
        My Teams
      </h2>
      <ul>
        {teams.map((team, index) => (
          <li key={index}>
            <button onClick={() => selectTeam(Object.values(team)[0])}>
              {Object.keys(team)[0]}
            </button>
          </li>
        ))}
      </ul>
  
      {teamName && (
        <div>
          <h2>
            Team Members
          </h2>
          <table className="team-members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member}>
                  <td>{member}</td>
                  <td>
                    <button onClick={() => handleLeaveTeam(member)}>
                      Remove player
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br/>
          <button onClick={() => leaveTeam()} style={{background: 'red', color: 'white'}}>Leave Team: {teamName}</button>
        </div>
      )}
      <br/>
      <button onClick={() => navigate('/manage-team')}>Click here to create a new team</button>
    </div>
  );
  
}

export default TeamStats;