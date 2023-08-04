import React, { useEffect, useState } from 'react';
import InvitePlayer from './invite_player';
import CreateTeam from './create_team';
import {
  Box,
  Button,
  Heading,
  Text,
  List,
  ListItem,
  Flex,
  Spacer,
  VStack,
} from "@chakra-ui/react";


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
      if(data.length>0){
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
      if(data.length>0){
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
      console.log(typeof(gamesPlayed));
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
              }
              else if (data.statusCode == 404) {
                  if(data.body == "User with email Admin not found in the DynamoDB item.")
                  alert('Member Not Found');
                  else if(data.body == "Item not found in the DynamoDB table.")
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

    // TODO: Implement leaving the team
  };

      function selectTeam(teamName: string): void {
        fetchTeamNames(user);
     //   fetchTeamMembersFromDynamoDB(teamName);
          setTeamName(teamName);
          console.log(teamName);
              const chosenTeam = teams.find((team) => team.teamName === teamName);
            fetchDataFromDynamoDB(teamName);
            fetchTeamMembersFromDynamoDB(teamName);
      }
// https://n39biejcka.execute-api.us-east-1.amazonaws.com/prod/increment add game wins losses api // to be called when user starts and finishes a game
return (
  <Box maxW="600px" mx="auto" p="20px">
    <VStack spacing={4}>
      <CreateTeam />
      <InvitePlayer />

      <Box>
        <Heading as="h2" size="lg" mb="10px">
          Team Statistics: {teamName}
        </Heading>
        <Text>Games Played: {gamesPlayed}</Text>
        <Text>
          Win/Loss Ratio: {winCount}/{lossCount}
        </Text>
        <Text>Total Points Earned: {totalPoints}</Text>
      </Box>

      <VStack spacing={2}>
        <Heading as="h3" size="md">
          ------------- Testing purpose -------------
        </Heading>
        <Flex>
          <Button onClick={handleAddGame}>Add Game</Button>
          <Button onClick={handleAddWin}>Add Win</Button>
          <Button onClick={handleAddLoss}>Add Loss</Button>
          <Button onClick={() => handleAddPoints(10)}>Add Points</Button>
        </Flex>
        <Heading as="h3" size="md">
          ------------- Testing purpose -------------
        </Heading>
      </VStack>

      <Heading as="h2" size="lg">
        My Team
      </Heading>
      <List>
        {teams.map((team, index) => (
          <ListItem key={index}>
            <Button onClick={() => selectTeam(Object.values(team)[0])}>
              {Object.keys(team)[0]}
            </Button>
          </ListItem>
        ))}
      </List>

      {teamName && (
        <Box>
          <Heading as="h2" size="lg">
            Team Members
          </Heading>
          <List>
            {teamMembers.map((member) => (
              <ListItem
                style={{ display: "flex", maxWidth: "fit-content" }}
                key={member}
              >
                {member}
                <Spacer />
                <Button onClick={() => handleLeaveTeam(member)}>
                  Remove player
                </Button>
              </ListItem>
            ))}
          </List>
          <Button onClick={() => handleLeaveTeam(user)}>Leave Team</Button>
        </Box>
      )}
    </VStack>
  </Box>
);
}

export default TeamStats;