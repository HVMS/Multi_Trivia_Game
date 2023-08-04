import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Card, Center, ChakraProvider, Heading, Text, useToast } from '@chakra-ui/react';
import { useNavigate  } from 'react-router-dom'; // Import useHistory hook

interface GameData {
  game_name: string;
  game_difficulty_level: string;
  game_timeframe: number;
}

interface Question {
  question_name: string;
  question_options: {
    L: { S: string }[];
  };
  question_right_answer: string;
}

const TIMER_KEY = 'quiz_timer';

const Temp: React.FC<{gameData : GameData}> = ({gameData}) => {
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const [optionsDisabled, setOptionsDisabled] = useState(false);  
  const [questions, setQuestions] = useState<Question[]>([]);
  
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

  const handleOptionClick = (index: number) => {
    if (!optionsDisabled) {
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
  
  return (
    <ChakraProvider>
      <Center h="100vh">
        <Box maxW="xl">
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
