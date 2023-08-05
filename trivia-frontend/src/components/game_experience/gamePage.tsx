import { ChakraProvider } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Question } from './Question';

const questions = [
    { id: 1, text: 'Question 1', correctAnswer: true },
    { id: 2, text: 'Question 2', correctAnswer: false },
    { id: 3, text: 'Question 3', correctAnswer: true },
    { id: 4, text: 'Question 4', correctAnswer: false },
  ];

const PlayGamePage = () => {
    const [answers, setAnswers] = useState<boolean[]>([]);
    const [score, setScore] = useState<number>(0);
    const [websocket, setWebSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // Create WebSocket connection
        const ws = new WebSocket('ws://localhost:8080');
    
        // Listen for messages from the server
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'scoreUpdate') {
            setScore(data.score);
          }
        };
    
        // Save the WebSocket connection for future use
        setWebSocket(ws);
    
        // Clean up the WebSocket connection on unmount
        return () => {
          ws.close();
        };
      }, []);

    const handleAnswerSelect = (questionId: number, answer: boolean) => {
        setAnswers((prevAnswers) => [...prevAnswers, answer]);

        // Send WebSocket event to the server with the selected answer
        if (websocket) {
            const message = JSON.stringify({
            type: 'answer',
            questionId,
            answer,
            });
            websocket.send(message);
        }
    };

    return (
        <ChakraProvider>
            <div>
                {questions.map((question) => (
                    <Question
                    key={question.id}
                    question={question}
                    onAnswerSelect={handleAnswerSelect}
                    />
                ))}
                <p>Current Score: {score}</p>
            </div>
        </ChakraProvider>
    );
};

export default PlayGamePage;