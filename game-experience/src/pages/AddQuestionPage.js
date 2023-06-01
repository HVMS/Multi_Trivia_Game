import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';

const AddQuestionPage = () => {
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [options, setOptions] = useState([]);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send the data to the server or perform further actions
    console.log({
      questionText,
      category,
      difficulty,
      options,
    });
    // Reset the form fields
    setQuestionText('');
    setCategory('');
    setDifficulty('');
    setOptions([]);
  };

  return (
    <Box p={4} maxWidth="500px" margin="0 auto">
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Question Text</FormLabel>
          <Textarea
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Category</FormLabel>
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="science">Science</option>
            <option value="cricket">Cricket</option>
            <option value="football">Football</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Difficulty Level</FormLabel>
          <Select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            required
          >
            <option value="">Select difficulty level</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Options</FormLabel>
          {options.map((option, index) => (
            <Box key={index} display="flex" mb={2}>
              <Input
                value={option}
                onChange={(event) =>
                  handleOptionChange(index, event.target.value)
                }
                required
              />
              <Button
                ml={2}
                colorScheme="red"
                onClick={() => handleDeleteOption(index)}
              >
                Delete
              </Button>
            </Box>
          ))}
          <Button colorScheme="blue" onClick={handleAddOption}>
            Add Option
          </Button>
        </FormControl>

        <Button type="submit" colorScheme="green">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AddQuestionPage;
