import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, UnorderedList, ListItem } from '@chakra-ui/react';

const QuestionBankPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          'https://m7jaudy364.execute-api.us-east-1.amazonaws.com/prod/getquiz'
        );
        const data = await response.json();

        const parsedData = JSON.parse(data.body); // Parse the body as JSON
        
        console.log(parsedData);
        setQuestions(parsedData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <Box p={4}>
        {questions.map((question) => (
        <Box key={question.question_id.S} my={4} borderWidth="1px" p={4} borderRadius="md">
            <Heading size="md">Difficulty Level: {question.difficulty_level.S}</Heading>
            <Text mt={2}>
            Question Category: <strong>{question.question_category.S}</strong>
            </Text>
            <Text mt={2} fontWeight="bold">
                Options:
            </Text>
            <UnorderedList>
                {question.options.L.map((option, index) => (
                <ListItem key={index}>{option.S}</ListItem>
                ))}
            </UnorderedList>
            <Text mt={2}>{question.questionText.S}</Text>
        </Box>
        ))}
    </Box>
  );
};

export default QuestionBankPage;
