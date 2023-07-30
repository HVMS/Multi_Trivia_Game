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
    FormErrorMessage, Button, Select, Heading } from '@chakra-ui/react';

interface Game {
    id: number;
    game_name: string;
}

interface Question {
    question_name: string;
    question_category: string;
    question_difficulty: string;
    game_name: string;
    question_options: string[];
    question_right_answer: string;
  }

const QuestionBase = () => {
    const [gamesList, setGamesList] = useState<Game[]>([]);
    const [selectedGame, setSelectedGame] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
    // Question Form State
    const [questionForm, setQuestionForm] = useState<Question>({
        question_name: '',
        question_category: '',
        question_difficulty: '',
        game_name: '',
        question_options: [],
        question_right_answer: '',
    });

    // Validation States
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Fetch the games list from the API
        fetchGamesList();
    }, []);

    // Modal Actions
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setErrors({});
        setIsModalOpen(false);
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

        // Validate game_name
        if (!questionForm.game_name) {
        newErrors['game_name'] = 'Game Name is required';
        }

        // Validate question_options
        if (questionForm.question_options.length === 0) {
        newErrors['question_options'] = 'At least one Question Option is required';
        }

        // Validate question_right_answer
        if (!questionForm.question_right_answer) {
        newErrors['question_right_answer'] = 'Question Right Answer is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
          // Perform form submission or API call here
          // If the form is valid, you can proceed with the submission or API call
          console.log('Form submitted:', questionForm);
        }
      };    

    const fetchGamesList = async () => {
        try {
        const response = await fetch('https://w3r49v036h.execute-api.us-east-1.amazonaws.com/prod/getgames');

        console.log("API Response :", response);

        const data = await response.json();

        console.log("data is : ",data);
        console.log("data type ", typeof(data));
        
        // Check if data is an array before setting it to state
        if (typeof data === "object" && !Array.isArray(data)) {
            const dataArray: Game[] = Object.values(data['body']);
            console.log("data is : ", dataArray);
            setGamesList(dataArray);
        } else {
            setGamesList([]); // If not an array, set an empty array
        }
        } catch (error) {
        console.error('Error fetching game data:', error);
        }
    };

    return (
        <ChakraProvider>
            <Box p={4}>
                    <Flex align="center" justify="space-between" padding="20px">
                        {/* Left-hand side */}
                        <Box>
                            <Heading as="h2" size="lg">
                                Questions By Games List
                            </Heading>
                        </Box>

                        {/* Right-hand side */}
                        <Box>
                            <Button colorScheme="teal" size="md" onClick={openModal}>
                                Add Questions
                            </Button>
                        </Box>
                    </Flex>
                <Box>
                    <Select
                    placeholder="Select a game"
                    onChange={(e) => setSelectedGame(e.target.value)}
                    value={selectedGame}
                    >
                    {gamesList.map((game) => (
                        <option key={game.id} value={game.game_name}>
                        {game.game_name}
                        </option>
                    ))}
                    </Select>
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

                        <FormControl isRequired isInvalid={!!errors.game_name} mt={4}>
                            <FormLabel>Game Name</FormLabel>
                            <Select
                            placeholder="Select a game"
                            value={questionForm.game_name}
                            onChange={(e) => setQuestionForm({ ...questionForm, game_name: e.target.value })}
                            >
                            {gamesList.map((game) => (
                                <option key={game.id} value={game.game_name}>
                                {game.game_name}
                                </option>
                            ))}
                            </Select>
                            <FormErrorMessage>{errors.game_name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.question_options} mt={4}>
                            <FormLabel>Question Options</FormLabel>
                            {/* Here, you can add a dynamic input field to add multiple options */}
                            {/* For simplicity, let's assume we have a static 4 input fields */}
                            {Array.from({ length: 4 }).map((_, index) => (
                            <Input
                                key={index}
                                placeholder={`Option ${index + 1}`}
                                value={questionForm.question_options[index] || ''}
                                onChange={(e) => {
                                const updatedOptions = [...questionForm.question_options];
                                updatedOptions[index] = e.target.value;
                                setQuestionForm({ ...questionForm, question_options: updatedOptions });
                                }}
                                mt={2}
                            />
                            ))}
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

                        <Button colorScheme="teal" mt={4} onClick={handleSubmit}>
                            Submit
                        </Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </ChakraProvider>
    );
};

export default QuestionBase;
