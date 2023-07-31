import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  useToast,
  FormErrorMessage,
  Button,
  Select,
  Heading,
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

interface Question {
  question_name: string;
  question_category: string;
  question_difficulty: string;
  question_options: string[];
  question_right_answer: string;
}

const QuestionBase = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [questionForm, setQuestionForm] = useState<Question>({
    question_name: '',
    question_category: '',
    question_difficulty: '',
    question_options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    question_right_answer: '',
  });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchQuestionList();
  }, []);

  const openAddModal = () => {
    setQuestionForm({
      question_name: '',
      question_category: '',
      question_difficulty: '',
      question_options: ['', '', '', ''],
      question_right_answer: '',
    });
    setEditingQuestion(null);
    setIsAddModalOpen(true);
    setIsEditModalOpen(false);
  };

  const openModal = (question: Question) => {
    const editingQuestionWithDefaults: Question = {
      ...questionForm,
      question_difficulty: '',
    };

    if (question) {

        console.log(question.question_options);
        console.log(typeof(question.question_options));

        const values = JSON.stringify(question);
        console.log(values);

        editingQuestionWithDefaults.question_name = question.question_name;
        editingQuestionWithDefaults.question_category = question.question_category;
        editingQuestionWithDefaults.question_difficulty = question.question_difficulty;
        editingQuestionWithDefaults.question_options = question.question_options;
        editingQuestionWithDefaults.question_right_answer = question.question_right_answer;
    } else {
      editingQuestionWithDefaults.question_options = ['', '', '', ''];
      setEditingQuestion(null);
    }

    setEditingQuestion(question);
    setQuestionForm(editingQuestionWithDefaults);
    setIsEditModalOpen(true);
    setIsAddModalOpen(false);
  };

  const closeModal = () => {
    setEditingQuestion(null);
    setQuestionForm({
      question_name: '',
      question_category: '',
      question_difficulty: '',
      question_options: ['', '', '', ''],
      question_right_answer: '',
    });
    setErrors({});
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate question_name
    if (!questionForm.question_name) {
      newErrors['question_name'] = 'Question Name is required';
    }

    // Validate question_category
    if (!questionForm.question_category) {
      newErrors['question_category'] = 'Question Category is required';
    }

    // Validate question_difficulty
    if (!questionForm.question_difficulty) {
      newErrors['question_difficulty'] = 'Question Difficulty is required';
    }

    // Validate question_options
    if (questionForm.question_options.length === 0) {
      newErrors['question_options'] = 'At least one Question Option is required';
    } else {
      // Check if any question option is empty
      if (questionForm.question_options.some((option) => option.trim() === '')) {
        newErrors['question_options'] = 'Question Options cannot be empty';
      }
    }

    // Validate question_right_answer
    if (!questionForm.question_right_answer) {
      newErrors['question_right_answer'] = 'Question Right Answer is required';
    } else {
      // Check if the question right answer is one of the options
      if (!questionForm.question_options.includes(questionForm.question_right_answer)) {
        newErrors['question_right_answer'] = 'Question Right Answer should be one of the options';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = async () => {
    if (validateForm()) {

        console.log(editingQuestion);
        console.log(questionForm);

        console.log(editingQuestion?.question_options);
        console.log(questionForm.question_options);

        console.log(JSON.stringify({ questionForm }));

        try {
            const response = await fetch('https://t7qqp9mnfk.execute-api.us-east-1.amazonaws.com/prod/updatequestions', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questionForm }),
            });

            const responseData = await response.json();

            if (responseData.statusCode === 200) {
                console.log('Question updated successfully in DynamoDB');
                console.log('Form submitted:', questionForm);

                // Show Success message
                toast({
                    title: 'Success',
                    description: 'Congrats!! Question Updated Successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Update the edited question in the questionList state
                if (editingQuestion) {
                    setQuestionList((prevQuestionList) =>
                    prevQuestionList.map((question) =>
                        question.question_name === editingQuestion.question_name ? questionForm : question
                    )
                    );
                }

                setIsEditModalOpen(false);

                // Reset the form fields
                closeModal();

            } else {
            console.error('Error updating question in DynamoDB');
            // Show Error message
            toast({
                title: 'Error',
                description: 'Ops!! Something went wrong in the question updating process.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            }
        } catch (error) {
            console.log('Error updating question:', error);
        }
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log(questionForm);
      console.log(JSON.stringify({ questionForm }));
      try {
        const response = await fetch('https://t7qqp9mnfk.execute-api.us-east-1.amazonaws.com/prod/addquestion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questionForm }),
        });

        const responseData = await response.json();

        if (responseData.statusCode === 200) {
          console.log('Question added successfully to DynamoDB');
          console.log('Form submitted:', questionForm);

          // Show Success message
          toast({
            title: 'Success',
            description: 'Congrats!! Question Added Successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          // Add the new question to the questionList state
          setQuestionList((prevQuestionList) => [...prevQuestionList, questionForm]);
          // Reset the form fields
          resetForm();

          // Close the modal
          setIsAddModalOpen(false);
        } else if (responseData.statusCode === 409) {
          // Successful API call, perform further actions if needed
          console.log('The Question name you created is already exists...');

          // Show Error message
          toast({
            title: 'Error',
            description: 'Ops!! Question name already exists.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          console.error('Error adding question to DynamoDB');
          // Show Error message
          toast({
            title: 'Error',
            description: 'Ops!! Something went wrong in the question adding process.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.log('error in creating questions', error);
      }
    }
  };

  const fetchQuestionList = async () => {
    try {
      const response = await fetch('https://t7qqp9mnfk.execute-api.us-east-1.amazonaws.com/prod/getquestions');

      const data = await response.json();
      console.log(data);
      console.log("Question list data : ",data);
      console.log(typeof(data));

      // Check if data is an array before setting it to state
      if (typeof data === 'object' && !Array.isArray(data)) {
        const dataArray: Question[] = Object.values(data['body']);
        console.log("Data Array is : ",dataArray);
        const formattedQuestionList = dataArray.map((item:any) => {
          const options = item.question_options?.L?.map((option:any) => option.S) || [];
          const formattedQuestion = {
            question_name: item.question_name,
            question_category: item.question_category,
            question_difficulty: item.question_difficulty,
            question_options: options,
            question_right_answer: item.question_right_answer,
          };
  
          console.log('Formatted Question:', formattedQuestion);
          return formattedQuestion;
        });
        setQuestionList(formattedQuestionList);
        setIsLoading(false);
      } else {
        setQuestionList([]); // If not an array, set an empty array
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching question data:', error);
    }
  };

  const handleDelete = async (questionName: string) => {
    try {
      console.log(questionName);

      const response = await fetch('https://t7qqp9mnfk.execute-api.us-east-1.amazonaws.com/prod/deletequestion', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionName }),
      });

      console.log(response);

      const responseData = await response.json();

      console.log(responseData);

      if (responseData.statusCode === 200) {
        console.log(`Question "${questionName}" deleted successfully`);
        // Update questionList state by filtering out the deleted question
        setQuestionList((prevQuestionList) => prevQuestionList.filter((question) => question.question_name !== questionName));
      } else {
        console.error(`Error deleting question "${questionName}"`);
        // Show Error message
        toast({
          title: 'Error',
          description: `Ops!! Error deleting question "${questionName}"`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log('Error deleting question:', error);
    }
  };

    const resetForm = () => {
        setQuestionForm({
            question_name: '',
            question_category: '',
            question_difficulty: '',
            question_options: [],
            question_right_answer: '',
        });
        setErrors({}); // Clear the validation errors as well
    };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Flex align="center" justify="space-between" padding="20px">
          {/* Left-hand side */}
          <Box>
            <Heading as="h2" size="lg">
              Questions List
            </Heading>
          </Box>

          {/* Right-hand side */}
          <Box>
            <Button colorScheme="green" size="md" onClick={openAddModal}>
              Add Questions
            </Button>
          </Box>
        </Flex>
        <Box>
          {isLoading ? (
            <Heading as="h3" size="md">
              Loading...
            </Heading>
          ) : questionList.length === 0 ? (
            <Heading as="h3" size="lg" textAlign="center">
              No Questions added yet
            </Heading>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Question Name</Th>
                  <Th>Question Category</Th>
                  <Th>Question Difficulty</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {questionList.map((question, index) => (
                  <Tr key={index}>
                    <Td>{question.question_name}</Td>
                    <Td>{question.question_category}</Td>
                    <Td>{question.question_difficulty}</Td>
                    <Td>
                      <Button colorScheme="blue" size="sm" m={2} onClick={() => openModal(question)}>
                        Edit
                      </Button>
                      <Button colorScheme="red" size="sm" m={2} onClick={() => handleDelete(question.question_name)}>
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Box>
      {/* Add Question Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.question_name}>
              <FormLabel>Question Name</FormLabel>
              <Input
                value={questionForm.question_name}
                onChange={(e) => setQuestionForm({ ...questionForm, question_name: e.target.value })}
                placeholder="Enter question name"
              />
              <FormErrorMessage>{errors.question_name}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.question_category}>
              <FormLabel>Question Category</FormLabel>
              <Select
                  placeholder="Select a category"
                  value={questionForm.question_category}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, question_category: e.target.value })
                  }
                >
                  <option value="science">Science</option>
                  <option value="cricket">Cricket</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="history">History</option>
                </Select>
              <FormErrorMessage>{errors.question_category}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.question_difficulty}>
              <FormLabel>Question Difficulty</FormLabel>
              <Select
                value={questionForm.question_difficulty}
                onChange={(e) => setQuestionForm({ ...questionForm, question_difficulty: e.target.value })}
                placeholder="Select question difficulty"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
              <FormErrorMessage>{errors.question_difficulty}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Question Options (MCQ)</FormLabel>
              {questionForm.question_options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...questionForm.question_options];
                    updatedOptions[index] = e.target.value;
                    setQuestionForm({ ...questionForm, question_options: updatedOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                  mt={2}
                />
              ))}
              <FormErrorMessage>{errors.question_options}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.question_right_answer}>
              <FormLabel>Question Right Answer</FormLabel>
              <Select
                value={questionForm.question_right_answer}
                onChange={(e) => setQuestionForm({ ...questionForm, question_right_answer: e.target.value })}
                placeholder="Select the right answer"
              >
                {questionForm.question_options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.question_right_answer}</FormErrorMessage>
            </FormControl>
            <Button colorScheme="green" mt={4} p={3} onClick={handleSubmit}>
                Submit
            </Button>
            <Button colorScheme="gray" mt={4} p={3} onClick={closeModal}>
                Cancel
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Edit Question Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.question_name}>
              <FormLabel>Question Name</FormLabel>
              <Input
                value={questionForm.question_name}
                onChange={(e) => setQuestionForm({ ...questionForm, question_name: e.target.value })}
                placeholder="Enter question name"
                isDisabled
              />
              <FormErrorMessage>{errors.question_name}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.question_category}>
              <FormLabel>Question Category</FormLabel>
              <Select
                  placeholder="Select a category"
                  value={questionForm.question_category}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, question_category: e.target.value })
                  }
                >
                  <option value="science">Science</option>
                  <option value="cricket">Cricket</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="history">History</option>
                </Select>
              <FormErrorMessage>{errors.question_category}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.question_difficulty}>
              <FormLabel>Question Difficulty</FormLabel>
              <Select
                value={questionForm.question_difficulty}
                onChange={(e) => setQuestionForm({ ...questionForm, question_difficulty: e.target.value })}
                placeholder="Select question difficulty"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
              <FormErrorMessage>{errors.question_difficulty}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Question Options (MCQ)</FormLabel>
              {questionForm.question_options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...questionForm.question_options];
                    updatedOptions[index] = e.target.value;
                    setQuestionForm({ ...questionForm, question_options: updatedOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                  mt={2}
                />
              ))}
              <FormErrorMessage>{errors.question_options}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.question_right_answer}>
              <FormLabel>Question Right Answer</FormLabel>
              <Select
                value={questionForm.question_right_answer}
                onChange={(e) => setQuestionForm({ ...questionForm, question_right_answer: e.target.value })}
                placeholder="Select the right answer"
              >
                {questionForm.question_options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.question_right_answer}</FormErrorMessage>
            </FormControl>
            <Button colorScheme="green" mt={4} p={3} onClick={handleEdit}>
                Update
            </Button>
            <Button colorScheme="gray" mt={4} p={3} onClick={closeModal}>
                Cancel
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default QuestionBase;