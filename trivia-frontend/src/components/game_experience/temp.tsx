import React, { useState } from 'react';
import { Box, Button, Card, Center, ChakraProvider, Heading, Text } from '@chakra-ui/react';

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

const Temp: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);


  const handleNextClick = () => {
    setSelectedOption(null);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isOptionSelected = selectedOption !== null;
  const isCorrectAnswer = isOptionSelected && currentQuestion.options[selectedOption] === currentQuestion.correctAnswer;


  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };
  
  return (
    <ChakraProvider>
      <Center h="100vh">
        <Box maxW="md">
          <Box borderWidth={2} borderRadius="lg" borderColor={isOptionSelected ? (isCorrectAnswer ? 'green' : 'red') : 'black'} p={8}>
            <Heading mb={4}>Question {currentQuestion.id}</Heading>
            <Text fontSize="xl" mb={4}>
              {currentQuestion.question}
            </Text>
            {currentQuestion.options.map((option, index) => (
              <Card
                key={index}
                onClick={() => handleOptionClick(index)}
                bg={selectedOption !== null ? (index === selectedOption ? (option === currentQuestion.correctAnswer ? 'green' : 'red') : (option === currentQuestion.correctAnswer ? 'green.100' : 'inherit')) : 'inherit'}
                p={4}
                borderRadius="md"
                cursor="pointer"
                mb={2}
              >
                <Text fontSize="lg">{option}</Text>
              </Card>
            ))}
          </Box>
          <Button onClick={handleNextClick} mt={4} colorScheme="blue" isDisabled={!isOptionSelected}>
            Next
          </Button>
        </Box>
      </Center>
    </ChakraProvider>
  );
};

export default Temp;
