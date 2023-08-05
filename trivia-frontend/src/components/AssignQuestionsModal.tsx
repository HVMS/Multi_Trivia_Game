import { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Checkbox, Stack } from "@chakra-ui/react";
import { ModalProps, useToast } from "@chakra-ui/react";

interface Question {
  question_name: string;
  question_options: string[];
  question_right_answer: string;
  question_category: string; // Corrected property name
  question_difficulty: string; // Corrected property name
}

interface AssignQuestionsModalProps extends Omit<ModalProps, "children">{
  isOpen: boolean;
  onClose: () => void;
  selectedGameName: string;
  selectedGameCategory: string;
  selectedDifficulty: string;
  selectedQuestion: string[];
}

const AssignQuestionsModal: React.FC<AssignQuestionsModalProps> = ({ isOpen, onClose, selectedGameName, selectedGameCategory, selectedDifficulty, selectedQuestion  }) => {
    
    const toast = useToast();
    
    const [questionList, setQuestionList] = useState<Question[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [initialSelectedQuestions, setInitialSelectedQuestions] = useState<string[]>([]);

    console.log(selectedGameName);

    useEffect(() => {
        // Fetch question data based on selected game category and difficulty
        fetchQuestionList();
    }, [selectedGameCategory, selectedDifficulty]);

     // Initialize the selectedQuestions state with the provided prop
    useEffect(() => {
        setSelectedQuestions(selectedQuestions);
        setInitialSelectedQuestions(selectedQuestions);
    }, [selectedQuestions]);

    const fetchQuestionList = async () => {

        console.log(selectedGameCategory);
        console.log(selectedDifficulty);

        try {
            const response = await fetch('https://t7qqp9mnfk.execute-api.us-east-1.amazonaws.com/prod/getquestions');
            const data = await response.json();

            if (typeof data === "object" && Array.isArray(data['body'])) {
                const questionFromResponse: Question[] = Object.values(data['body']);
                console.log("Question list",questionFromResponse);

                // Filter questions based on selected game category and difficulty
                const filteredQuestions: Question[] = questionFromResponse.filter((question) => (
                    question.question_category.toLowerCase() === selectedGameCategory.toLowerCase() && 
                    question.question_difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
                  ));

                console.log("filtered Questions list",filteredQuestions);
                setQuestionList(filteredQuestions);

            }else{
                console.log("False data");
            }
        } catch (error) {
            console.error('Error fetching question data:', error);
        }
    };

    const handleCheckboxChange = (questionName: string) => {
        // Add or remove the question from the selectedQuestions array
        setSelectedQuestions((prevSelectedQuestions) => {
            if (prevSelectedQuestions.includes(questionName)) {
                return prevSelectedQuestions.filter((name) => name !== questionName);
            } else {
                return [...prevSelectedQuestions, questionName];
            }
        }
        );
    };

    const handleAssignQuestions = async () => {
        console.log("Selected Questions:", selectedQuestions);

        // Update the initialSelectedQuestions to maintain the checked state after assign button is clicked
        setInitialSelectedQuestions(selectedQuestions);

        try {
            // Prepare the data to send in the "POST" API call
            const postData = {
              game_name: selectedGameName,
              selected_question_names: selectedQuestions.map((questionName) => {
                const question = questionList.find((q) => q.question_name === questionName);
                return {
                  question_name: questionName,
                  question_options: question?.question_options || [],
                  question_right_answer: question?.question_right_answer || "",
                };
              }),
            };

            console.log(postData);
        
            // Make the "POST" API call to store the selected questions
            const response = await fetch('https://76zhbkbpj1.execute-api.us-east-1.amazonaws.com/prod/assignquestions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(postData),
            });

            console.log("API Response is : ",response);
        
            if (response.status === 200) {
                
                // The API call was successful, show a success toast message
                toast({
                    title: "Success",
                    description: "Questions assigned successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
        
                // Close the modal
                onClose();
            } else {
              // If the API call fails, show an error toast message
              toast({
                title: "Error",
                description: "Something went wrong...please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          } catch (error) {
            console.error('Error assigning questions:', error);
        
            // Show an error toast message if an error occurs
            toast({
              title: "Error",
              description: "Something went wrong...please try again.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
    };

    const handleCancel = () => {
        // Reset the selectedQuestions to maintain the checked state after the "Cancel" button is clicked
        setSelectedQuestions([]);
        setInitialSelectedQuestions([]);
    
        // Close the modal
        onClose();
      };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Assign Questions</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Stack spacing={4}>
                {questionList.map((question) => (
                <Checkbox
                    key={question.question_name}
                    isChecked={selectedQuestions.includes(question.question_name)}
                    onChange={() => handleCheckboxChange(question.question_name)}
                >
                    {question.question_name}
                </Checkbox>
                ))}
            </Stack>
            </ModalBody>
            <ModalFooter>
            <Button colorScheme="blue" onClick={handleAssignQuestions}>Assign</Button>
            <Button colorScheme="gray" onClick={handleCancel}>Cancel</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
};

export default AssignQuestionsModal;