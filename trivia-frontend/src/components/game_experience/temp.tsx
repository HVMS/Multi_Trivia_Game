import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Card, Center, ChakraProvider, Heading, Text, useToast } from '@chakra-ui/react';
import { useNavigate  } from 'react-router-dom'; // Import useHistory hook
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

interface GameData {
  game_name: string;
  game_difficulty_level: string;
  game_timeframe: number;
  userEmail: string;
  team_name: string;
}

interface Question {
  question_name: string;
  question_options: {
    L: { S: string }[];
  };
  question_right_answer: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyBzD6iYIqdaFWr-UYiR7AI12TEdY235sR0",
  authDomain: "serverlesssdp3.firebaseapp.com",
  projectId: "serverlesssdp3",
  storageBucket: "serverlesssdp3.appspot.com",
  messagingSenderId: "248193786486",
  appId: "1:248193786486:web:28b88f1458d87328177557",
  measurementId: "G-8G72EE3EJN"
};

const TIMER_KEY = 'quiz_timer';

const Temp: React.FC<{gameData : GameData}> = ({gameData}) => {
  
  const [userScore, setUserScore] = useState(0);
  const [teamScore, setTeamScore] = useState<number>(0);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const [optionsDisabled, setOptionsDisabled] = useState(false);  
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const currentURL = window.location.href;
    const queryParams = new URLSearchParams();
    queryParams.set('user', gameData.userEmail);
    queryParams.set('teamName', gameData.team_name);
    queryParams.set('gameName', gameData.game_name);
    const newURL = currentURL.split('?')[0] + '?' + queryParams.toString();
    window.history.pushState({}, '', newURL);
  }, [gameData]);
  
  const toast = useToast();
  const navigate = useNavigate();
  
  const [isLastQuestionDisplayed, setIsLastQuestionDisplayed] = useState(false);
  const initialTimeframe = useMemo(() => {
    const storedTimeframe = localStorage.getItem(TIMER_KEY);
    if (storedTimeframe) {
      return parseInt(storedTimeframe, 10);
    }
    return gameData.game_timeframe;
  }, [gameData.game_timeframe]);

  const [timeRemaining, setTimeRemaining] = useState(initialTimeframe);

  useEffect(() => {
    localStorage.setItem(TIMER_KEY, timeRemaining.toString());
    if (timeRemaining === 0) {
      localStorage.removeItem(TIMER_KEY);
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsLastQuestionDisplayed(true);
    } else {
      setIsLastQuestionDisplayed(false);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    
    initializeApp(firebaseConfig);

    fetchData();
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      handleTimerEnd();
      redirectToLeaderBoard();
    }
  }, [timeRemaining]);

  const redirectToLeaderBoard = () => {
    navigate('/leaderboard');
  };

  const handleTimerEnd = () => {
    toast({
      title: 'Time is up!',
      description: 'The quiz has ended.',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
    setSelectedOption(null);
    setOptionsDisabled(true);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isOptionSelected = selectedOption !== null;
  const isCorrectAnswer =
    isOptionSelected && currentQuestion?.question_options.L[selectedOption].S === currentQuestion.question_right_answer;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    const fetchTeamScore = async () => {
      try {
        const firestore = getFirestore();
        const gameScoreRef = doc(firestore, 'gameScore', 'gameDetails');
        const gameScoreSnapshot = await getDoc(gameScoreRef);
  
        if (gameScoreSnapshot.exists()) {
          const gameData = gameScoreSnapshot.data();
          setTeamScore(gameData?.teamScore || 0);
        }
      } catch (error) {
        console.error('Error fetching team score:', error);
      }
    };
  
    fetchTeamScore();
  }, []);

  const handleOptionClick = (index: number) => {
    if (!optionsDisabled) {
      if (currentQuestion.question_options.L[index].S === currentQuestion.question_right_answer) {
        // If the selected option is correct, increment the user's score
        setUserScore((prevScore) => prevScore + 1);

        // Increment the team score as well
        setTeamScore((prevScore) => prevScore + 1);
        
        // Update the team score in the database
        updateTeamScoreInDatabase(teamScore + 1);

      }
      setSelectedOption(index);
      setOptionsDisabled(true);
    }
  };

  // Function to make the API call
  const fetchData = async () => {
    console.log(gameData.game_name);
    try {
      const response = await fetch('https://76zhbkbpj1.execute-api.us-east-1.amazonaws.com/prod/assignquestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game_name : gameData.game_name }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }else{
        const responseBody = await response.json();
        const questions = responseBody.body;

        // Update the state with the fetched questions
        setQuestions(questions);

        console.log("Questions:", questions);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNextClick = () => {
    setSelectedOption(null);
    setOptionsDisabled(false);
    if (currentQuestionIndex === questions.length - 1) {
      // If the current question is the last question, do not allow the "Next" button click.
      return;
    }
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  const handleFinishClick = () => {
    // Perform any action you want when the user tries to finish the quiz prematurely
    // For example, show a toast message or a modal
    toast({
      title: 'Cannot Finish Yet!',
      description: 'Please answer all questions before finishing the quiz.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  const updateTeamScoreInDatabase = async (newTeamScore: number) => {
    try {
      const firestore = getFirestore();
      const gameScoreRef = doc(firestore, 'teamScore', 'teamDetails');
      console.log("Team score: ",newTeamScore);

      const teamData = {
        teamScore: newTeamScore,
      };
      await setDoc(gameScoreRef, teamData);
    } catch (error) {
      console.error('Error updating team score:', error);
    }
  };

  useEffect(() => {
    const updateScore = async () => {
      try {
        const firestore = getFirestore();
        const userScoreRef = doc(firestore, 'gameScore', 'gameDetails');

        // Create an object with the user information and score
        const userData = {
          email: gameData.userEmail,
          teamName: gameData.team_name,
          gameName: gameData.game_name,
          score: userScore,
        };

        await setDoc(userScoreRef, userData);
      } catch (error) {
        console.error('Error updating score:', error);
      }
    };

    updateScore();
  }, [userScore]);
  
  return (
    <ChakraProvider>
      <Center h="100vh">
        <Box maxW="xl">
          <Box position="absolute" top={4} left={4} fontSize="xl">
            Current Score: {userScore}
          </Box>
          <Box position="absolute" top={36} left={4} fontSize="xl">
            Team Score: {teamScore}
          </Box>
          <Box position="absolute" top={4} right={4} fontSize="xl">
            Time remaining: {timeRemaining} s
          </Box>
          {currentQuestion ? ( // Check if currentQuestion exists before accessing its properties
            <Box borderWidth={2} borderRadius="lg" borderColor={isOptionSelected ? (isCorrectAnswer ? 'green' : 'red') : 'black'} p={8}>
              <Heading mb={4}>Question {currentQuestionIndex + 1}</Heading>
              <Text fontSize="xl" mb={4}>
                {currentQuestion.question_name}
              </Text>
              {currentQuestion.question_options.L.map((option, index) => (
                <Card
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  bg={
                    optionsDisabled
                      ? option.S === currentQuestion.question_right_answer
                        ? 'green'
                        : selectedOption === index
                        ? 'red'
                        : 'inherit'
                      : 'inherit'
                  }
                  p={4}
                  borderRadius="md"
                  cursor={optionsDisabled ? 'not-allowed' : 'pointer'}
                  mb={2}
                >
                  <Text fontSize="lg">{option.S}</Text>
                </Card>
              ))}
            </Box>
          ) : (
            <Text fontSize="xl">Loading questions...</Text>
          )}
          {!isLastQuestionDisplayed && (
            <Button onClick={handleNextClick} mt={4} colorScheme="blue" isDisabled={!isOptionSelected}>
              Next
            </Button>
          )}
          {isLastQuestionDisplayed && (
            <Button onClick={handleFinishClick} mt={4} colorScheme="green" isDisabled={!isOptionSelected}>
              Finish
            </Button>
          )}
        </Box>
      </Center>
    </ChakraProvider>
  );
};

export default Temp;
