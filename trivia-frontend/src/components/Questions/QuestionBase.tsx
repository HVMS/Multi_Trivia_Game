import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Flex, 
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
    FormErrorMessage, Button, Select, Heading } from '@chakra-ui/react';
    import { Table, Thead, Tbody, Tr, Th, Td} from "@chakra-ui/react"

interface Game {
    id: number;
    game_name: string;
}

interface Question {
    question_name: string;
    question_category: string;
    question_difficulty: string;
    question_options: string[];
    question_right_answer: string;
  }

const QuestionBase = () => {

    const toast = useToast();
    const [gamesList, setGamesList] = useState<Game[]>([]);
    const [selectedGame, setSelectedGame] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [questionList, setQuestionList] = useState<Question[]>([]);
  
    // Question Form State
    const [questionForm, setQuestionForm] = useState<Question>({
        question_name: '',
        question_category: '',
        question_difficulty: '',
        question_options: [],
        question_right_answer: '',
    });

    // Validation States
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Fetch the games list from the API
        fetchQuestionList();
    }, []);

    // Modal Actions
    const openModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        resetForm();
        setIsModalOpen(false);
    };

    // Function to add a new option field
    const addOption = () => {
        setQuestionForm({ ...questionForm, question_options: [...questionForm.question_options, ''] });
    };

    // Function to remove an option field
    const removeOption = (index: number) => {
        const updatedOptions = [...questionForm.question_options];
        updatedOptions.splice(index, 1);
        setQuestionForm({ ...questionForm, question_options: updatedOptions });
    };

    // Form Validation
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
        }else {
        // Check if the question right answer is one of the options
            if (!questionForm.question_options.includes(questionForm.question_right_answer)) {
                newErrors['question_right_answer'] = 'Question Right Answer should be one of the options';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Function to reset the form fields
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

    const handleSubmit = async () => {
        if (validateForm()) {

            try{
                const response = await fetch('https://t7qqp9mnfk.execute-api.us-east-1.amazonaws.com/prod/addquestion',{
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ questionForm }),
                })

                const responseData = await response.json();

                console.log("API Response is : ",responseData);

                if (responseData.statusCode === 200) {
                    console.log('Question added successfully to DynamoDB');
                    console.log('Form submitted:', questionForm);

                    console.log("body of response is : ",response.body);

                    // Show Success message
                    toast({
                        title: "Success",
                        description: "Congrats!! Question Added Successfully.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });

                    // Add the new question to the questionList state
                    setQuestionList(prevQuestionList => [...prevQuestionList, questionForm]);
                    // Reset the form fields
                    resetForm();

                    // Close the modal
                    setIsModalOpen(false);

                  } else if (responseData.statusCode === 409){
                    // Successful API call, perform further actions if needed
                    console.log('The Question name you created is already exists...');
        
                    // Show Error message
                    toast({
                        title: "Error",
                        description: "Ops!! Question name already exists.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                  } else {
                    console.error('Error adding question to DynamoDB');
                     // Show Error message
                    toast({
                        title: "Error",
                        description: "Ops!! Something went wrong in the question adding process.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                  }
            }catch(error){
                console.log("error in creating questions", error);
            }
        }
    };    

    const fetchQuestionList = async () => {
        try {
          const response = await fetch('https://t7qqp9mnfk.execute-api.us-east-1.amazonaws.com/prod/getquestions');

          const data = await response.json();
          
          // Check if data is an array before setting it to state
          if (typeof data === "object" && !Array.isArray(data)) {
            const dataArray: Question[] = Object.values(data['body']);
            setQuestionList(dataArray);
          } else {
            setQuestionList([]); // If not an array, set an empty array
          }
        } catch (error) {
          console.error('Error fetching question data:', error);
        }
      };

    // Function to delete a question
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
                    title: "Error",
                    description: `Ops!! Error deleting question "${questionName}"`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log("Error deleting question:", error);
        }
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
                        <Button colorScheme="green" size="md" onClick={openModal}>
                            Add Questions
                        </Button>
                    </Box>
                </Flex>
                <Box>
                    {questionList.length === 0 ? (
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
                                            {/* Edit and Delete buttons for each row */}
                                            <Button colorScheme="blue" size="sm" mr={2}>
                                                Edit
                                            </Button>
                                            <Button colorScheme="red" size="sm" onClick={() => handleDelete(question.question_name)}>
                                                Delete
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>    

                {/* Modal */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create Question</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <FormControl isRequired isInvalid={!!errors.question_name}>
                            <FormLabel>Question Name</FormLabel>
                            <Input
                            placeholder="Enter question name"
                            value={questionForm.question_name}
                            onChange={(e) =>
                                setQuestionForm({ ...questionForm, question_name: e.target.value })
                            }
                            />
                            <FormErrorMessage>{errors.question_name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.question_category} mt={4}>
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

                        <FormControl isRequired isInvalid={!!errors.question_difficulty} mt={4}>
                            <FormLabel>Question Difficulty</FormLabel>
                            <Select
                            placeholder="Select difficulty"
                            value={questionForm.question_difficulty}
                            onChange={(e) =>
                                setQuestionForm({ ...questionForm, question_difficulty: e.target.value })
                            }
                            >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            </Select>
                            <FormErrorMessage>{errors.question_difficulty}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.question_options} mt={4}>
                            <FormLabel>Question Options</FormLabel>
                            {questionForm.question_options.map((option, index) => (
                            <Flex key={index} mt={2}>
                                <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                    const updatedOptions = [...questionForm.question_options];
                                    updatedOptions[index] = e.target.value;
                                    setQuestionForm({ ...questionForm, question_options: updatedOptions });
                                }}
                                mr={2}
                                />
                                {/* Show "Delete" button when there are more than 2 options */}
                                {questionForm.question_options.length > 2 && (
                                <Button colorScheme="red" onClick={() => removeOption(index)}>
                                    Delete
                                </Button>
                                )}
                            </Flex>
                            ))}
                            {/* Show "Add" button */}
                            <Button colorScheme="teal" mt={2} onClick={addOption}>
                                Add Option
                            </Button>
                            <FormErrorMessage>{errors.question_options}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.question_right_answer} mt={4}>
                            <FormLabel>Question Right Answer</FormLabel>
                            <Input
                            placeholder="Enter right answer"
                            value={questionForm.question_right_answer}
                            onChange={(e) =>
                                setQuestionForm({ ...questionForm, question_right_answer: e.target.value })
                            }
                            />
                            <FormErrorMessage>{errors.question_right_answer}</FormErrorMessage>
                        </FormControl>

                        <Button colorScheme="green" mt={4} onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button colorScheme="gray" mt={4} onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </ChakraProvider>
    );
};

export default QuestionBase;
