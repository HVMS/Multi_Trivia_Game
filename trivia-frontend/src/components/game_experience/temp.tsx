import React, { useState, useEffect } from 'react';
import { Box, Button, Card, Center, ChakraProvider, Heading, Text, useToast } from '@chakra-ui/react';

const questions = [
    {
      id: 1,
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Rome'],
      correctAnswer: 'Paris',
    },
    {
      id: 2,
      question: 'What is the largest planet in our solar system?',
      options: ['Mars', 'Jupiter', 'Earth', 'Venus'],
      correctAnswer: 'Jupiter',
    },
    {
      id: 3,
      question: 'Which country is known as the Land of the Rising Sun?',
      options: ['China', 'Japan', 'Korea', 'Thailand'],
      correctAnswer: 'Japan',
    },
    {
      id: 4,
      question: 'What is the chemical symbol for water?',
      options: ['O', 'H', 'W', 'H2O'],
      correctAnswer: 'H2O',
    },
  ];

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

const Temp: React.FC<{gameData : GameData}> = ({gameData}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [optionsDisabled, setOptionsDisabled] = useState(false);  
  const [questions, setQuestions] = useState<Question[]>([]);
  const toast = useToast();
  const [initialTimeframe, setInitialTimeframe] = useState(gameData.game_timeframe);
  const [timeRemaining, setTimeRemaining] = useState(initialTimeframe);
  
  useEffect(() => {
    let globalTimer: NodeJS.Timeout;

    if (timeRemaining > 0) {
      globalTimer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      handleTimerEnd();
    }

    return () => clearInterval(globalTimer);
  }, [timeRemaining]);

  useEffect(() =>{
    fetchData();
  },[]);

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

  const handleNextClick = () => {
    setSelectedOption(null);
    setOptionsDisabled(false);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
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
          <Button onClick={handleNextClick} mt={4} colorScheme="blue" isDisabled={!isOptionSelected}>
            Next
          </Button>
        </Box>
      </Center>
    </ChakraProvider>
  );
};

export default Temp;
