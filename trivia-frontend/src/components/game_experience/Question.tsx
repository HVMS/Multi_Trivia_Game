// Question.tsx
import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';

interface QuestionProps {
  question: {
    id: number;
    text: string;
    correctAnswer: boolean;
  };
  onAnswerSelect: (questionId: number, answer: boolean) => void;
}

export const Question: React.FC<QuestionProps> = ({ question, onAnswerSelect }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const handleAnswerClick = (answer: boolean) => {
    setSelectedAnswer(answer);
    onAnswerSelect(question.id, answer);
  };

  return (
    <div>
      <p>{question.text}</p>
      <Button
        colorScheme={selectedAnswer === true ? 'green' : 'gray'}
        onClick={() => handleAnswerClick(true)}
      >
        True
      </Button>
      <Button
        colorScheme={selectedAnswer === false ? 'green' : 'gray'}
        onClick={() => handleAnswerClick(false)}
      >
        False
      </Button>
    </div>
  );
};
