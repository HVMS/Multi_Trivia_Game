import React, { useEffect, useState } from 'react';
//import AWS from 'aws-sdk';
import InvitePlayer from './invite_player';
import CreateTeam from './create_team';
import RemoveMember from './remove-member';
var AWS = require("aws-sdk");
// config.ts
//import envVariables from './importenv';


//const aws_access_key_id = envVariables.aws_access_key_id;
//const aws_secret_access_key = envVariables.aws_secret_access_key;
//const aws_session_token = envVariables.aws_session_token;

AWS.config.update({
  region: 'us-east-1',
  credentials: new AWS.Credentials({
      accessKeyId: "ASIA3EMVPIHUAGCW5UOI",
      secretAccessKey: "0Q6hEVE8aHGyyrTj/SHbF5Q5CfQZ3wsGcz4s5oyr",
      sessionToken: "FwoGZXIvYXdzEOT//////////wEaDNhFTXZZElqrRPmjtiLAAQY6RS0dHDvTva3Kg7aWr9ePmIHWOv3UgjOJ0fAv7/fHzv3WADHTxVbgNY1/eR8Qa1klD0a3A0yarz79y1RhNl9uY3wRoLEMli7FxQFP4hA7FZeWCx+WiScsmFioZUHDITke+FG1o4nJFhNKA8u8yvCTHjwCGhtAJVh6R/P8RgZiP0lf1AXtzBEuQe9MuFV8rQCl0HF+KmPAGFZ/rw86SLbkkaWQYDdWh5aMROPb0lEbP+iP24FeI4DaoXhQJrytyCj734ymBjItkEHwNPrZIfn12KwTv11fY3bgFhGBIczsekmpPa7emvy7uqVO4lGOF7gGX2Fx",
  }),
});

interface Team {
    teamName: string;
    gamesPlayed: number;
    winCount: number;
    lossCount: number;
    totalPoints: number;
  }
  
  function TeamStats() {
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [winCount, setWinCount] = useState(0);
    const [lossCount, setLossCount] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);
  

  const dynamodb = new AWS.DynamoDB();

  const fetchDataFromDynamoDB = async () => {
    const params = {
      TableName: 'TeamStats',
    };

    try {
      const data = await dynamodb.scan(params).promise();
      if (data.Items && data.Items.length > 0) {
        const teamDetails: Team[] = data.Items.map((item: { TeamID: { S: any; }; GamesPlayed: { N: any; }; Wins: { N: any; }; Losses: { N: any; }; TotalPoints: { N: any; }; }) => ({
          teamName: item.TeamID.S || '',
          gamesPlayed: Number(item.GamesPlayed.N || 0),
          winCount: Number(item.Wins.N || 0),
          lossCount: Number(item.Losses.N || 0),
          totalPoints: Number(item.TotalPoints.N || 0),
        }));

        setTeams(teamDetails);
      }
    } catch (error) {
      console.error('Error fetching data from DynamoDB:', error);
    }
  };

  const fetchTeamMembersFromDynamoDB = async (teamName: string | undefined) => {
    const params = {
      TableName: 'TeamDetails',
    };
    try{
      const data=await dynamodb.scan(params).promise();
  //    console.log(data.Items);
      console.log(teamName);
      let arr=[];
   //   console.log(data.Items)
      if (data.Items && data.Items.length > 0) {
     //   console.log(data.Items);
        for(let i=0;i<data.Items.length;i++){
        //  console.log(data.Items[i].TeamName.S);
          if( data.Items[i].TeamName.S===teamName){
            console.log(data.Items[i]);
            const size = Object.keys(data.Items[i]).length;
            console.log(size); // Output: 2
            for(let j=1;j<size;j++){
              console.log(data.Items[i][`user${j}`].S);
              arr.push(data.Items[i][`user${j}`].S);
            }

          }
        }
      }      
    }catch(error){
      console.error('Error fetching data from DynamoDB:', error);
    }

    }

  useEffect(() => {
    fetchTeamMembersFromDynamoDB(teamName);
    fetchDataFromDynamoDB();
  }, []);

  useEffect(() => {
    const chosenTeam = teams.find((team) => team.teamName === teamName);
    if (chosenTeam) {
      setGamesPlayed(chosenTeam.gamesPlayed);
      setWinCount(chosenTeam.winCount);
      setLossCount(chosenTeam.lossCount);
      setTotalPoints(chosenTeam.totalPoints);
    }
  }, [teamName, teams]);

  const handleAddGame = () => {
    //add data to dynamodb
    const params = {
        TableName: 'TeamStats',
        Item: {
            TeamID: { S: teamName },
            GamesPlayed: { N: String(gamesPlayed + 1) },
            Wins: { N: String(winCount) },
            Losses: { N: String(lossCount) },
            TotalPoints: { N: String(totalPoints) },
            },
        };
        dynamodb.putItem(params, (err: any, data: any) => {
            if (err) {
                console.error('Error adding game to DynamoDB', err);
            } else {
                console.log('Successfully added game to DynamoDB', data);
            }
        });
    setGamesPlayed(gamesPlayed + 1);
  };

  const handleAddWin = () => {
    const teamID = teamName;
    const params = {
        TableName: 'TeamStats',
        Key: {
            TeamID: { S: teamID },
        },
        UpdateExpression: 'SET Wins = Wins + :increment',
        ExpressionAttributeValues: {
            ':increment': { N: '1' }
        }
    };
        dynamodb.updateItem(params, (err: any, data: any) => {
            if (err) {
                console.error('Error adding win to DynamoDB', err);
            }
            else {
                console.log('Successfully added win to DynamoDB', data);
                setWinCount(winCount + 1);
            }
        });
    };

    const handleAddLoss = () => {
        const teamID = teamName;
        const params = {
          TableName: 'TeamStats',
          Key: {
            TeamID: { S: teamID },
          },
          UpdateExpression: 'SET Losses = Losses + :increment',
          ExpressionAttributeValues: {
            ':increment': { N: '1' }
          }
        };
      
        dynamodb.updateItem(params, (err: any, data: any) => {
          if (err) {
            console.error('Error adding loss to DynamoDB', err);
          } else {
            console.log('Successfully added loss to DynamoDB', data);
            setLossCount(lossCount + 1);
          }
        });
      };
      
  const handleAddPoints = (points: number) => {
    setTotalPoints(totalPoints + points);
  };

  const handleLeaveTeam = () => {
    // TODO: Implement leaving the team
  };

      function selectTeam(teamName: string): void {
        fetchDataFromDynamoDB();
        fetchTeamMembersFromDynamoDB(teamName);
          setTeamName(teamName);
      }
// https://n39biejcka.execute-api.us-east-1.amazonaws.com/prod/increment add game wins losses api // to be called when user starts and finishes a game
  return (
    <div>
      <CreateTeam/>
      <InvitePlayer/>
      <h2>Team Statistics: {teamName}</h2>
      <p>Games Played: {gamesPlayed}</p>
      <p>Win/Loss Ratio: {winCount}/{lossCount}</p>
      <p>Total Points Earned: {totalPoints}</p>
      <h3>------------- Testing purpose -------------</h3>
      <button onClick={handleAddGame}>Add Game</button>
      <button onClick={handleAddWin}>Add Win</button>
      <button onClick={handleAddLoss}>Add Loss</button>
      <button onClick={() => handleAddPoints(10)}>Add Points</button>
      <h3>------------- Testing purpose -------------</h3>

      <h2>My Team Stats</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.teamName}>
            <button onClick={() => selectTeam(team.teamName)}>
              {team.teamName}
            </button>
          </li>
        ))}
      </ul>
        <h2>Team Members</h2>
        <ul>
            {teamMembers.map((member) => (
                <li key={member}>{member}</li>
            ))}
        </ul>
      <button onClick={handleLeaveTeam}>Leave Team</button>
      <RemoveMember/>
      <br/>
      <br/>
      
    </div>
  );
}

export default TeamStats;
