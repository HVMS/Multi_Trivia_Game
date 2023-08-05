// import React, { useState, useEffect, useMemo } from 'react';
// import { Box, Button, Card, Center, ChakraProvider, Heading, Text, useToast } from '@chakra-ui/react';
// import { useNavigate, useLocation  } from 'react-router-dom'; // Import useHistory hook
// import { initializeApp } from 'firebase/app';
// import { getFirestore, doc, updateDoc, setDoc, addDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';

// interface GameData {
//   game_name: string;
//   gameDifficultyLevel: string;
//   gameTimeFrame: string;
//   gameCategory: string;
// }

// interface Question {
//   question_name: string;
//   question_options: {
//     L: { S: string }[];
//   };
//   question_right_answer: string;
// }

// interface TeamData {
//   team_name: string;
//   userEmail?: string[];
// }

// const firebaseConfig = {
//   apiKey: "AIzaSyBzD6iYIqdaFWr-UYiR7AI12TEdY235sR0",
//   authDomain: "serverlesssdp3.firebaseapp.com",
//   projectId: "serverlesssdp3",
//   storageBucket: "serverlesssdp3.appspot.com",
//   messagingSenderId: "248193786486",
//   appId: "1:248193786486:web:28b88f1458d87328177557",
//   measurementId: "G-8G72EE3EJN"
// };

// const TIMER_KEY = 'quiz_timer';

// const Temp = () => {

//   const location = useLocation();

//   const gameNameFromState = location.state.gameName;
//   console.log(gameNameFromState);
//   console.log(typeof gameNameFromState);

//   const teamNameFromState = location.state.teamName;
//   console.log(teamNameFromState);
//   console.log(typeof teamNameFromState);

//   // Making a temp list of users
//   const teamMembersList : string[] = [
//     'test1@gmail.com',
//     'test2@gmail.com',
//   ];

//   useEffect(() => {
//     fetchGameTimeFrameResponse();
//     fetchData();
//   }, []);

//   // Initialize the gameTimeFrame state using localStorage or fetch from API
//   const [gameTimeFrame, setGameTimeFrame] = useState<number | null>(() => {
//     // Check if the gameTimeFrame already exists in localStorage
//     const storedTimeFrame = localStorage.getItem(TIMER_KEY);
//     if (storedTimeFrame) {
//       return Number(storedTimeFrame);
//     } else {
//       return null;
//     }
//   });

//   const [data, setData] = useState<string|null>(null);

//   const userData = localStorage.getItem('persist:root');
//   if (userData) {
//     const parsedData = JSON.parse(userData);
//     console.log(parsedData['user']);

//     const userEmailId = parsedData['user'];
//     if (teamMembersList.includes(userEmailId)){
//       setData(userEmailId);
//       console.log("user is present : ",userEmailId);
//     }else{
//       console.log("not logged in yet");
//     }
//   }else{
//     console.log("wrong data");
//   }

//   // Function to decrement gameTimeFrame every second
//   useEffect(() => {
//     let timerId: NodeJS.Timeout;

//     if (gameTimeFrame && gameTimeFrame > 0) {
//       timerId = setInterval(() => {
//         setGameTimeFrame((prevTime) => {
//           const newTime = prevTime ? prevTime - 1 : null;

//           // Store the newTime in localStorage
//           if (newTime !== null) {
//             localStorage.setItem(TIMER_KEY, String(newTime));
//           } else {
//             // Remove the item from localStorage when newTime is null
//             localStorage.removeItem(TIMER_KEY);
//             // Display toast message when the time reaches zero
//             toast({
//               title: 'Time is up!',
//               description: 'The time for the quiz has ended.',
//               status: 'warning',
//               duration: 5000,
//               isClosable: true,
//             });
//             // Clear the interval
//             clearInterval(timerId);
//           }

//           return newTime;
//         });
//       }, 1000);
//     }

//     // Clean up the interval when the component unmounts
//     return () => clearInterval(timerId);
//   }, [gameTimeFrame]);

//   const fetchGameTimeFrameResponse = async () => {
//     try {
//       const response = await fetch('https://w3r49v036h.execute-api.us-east-1.amazonaws.com/prod/getgames');
//       const data = await response.json();
      
//       // Check if data is an array before setting it to state
//       if (typeof data === "object" && !Array.isArray(data)) {
//         const dataArray = Object.values(data['body']);

//         const gameDataFromResponse : any = dataArray.find((game:any) => game.game_name === gameNameFromState);

//         if (gameDataFromResponse){
//           const timeFrame = gameDataFromResponse.gameTimeFrame;
//           const parsedTimeFrame = Number(timeFrame.replace(/\D/g, ''));
//           setGameTimeFrame(parsedTimeFrame);
//         }else{
//           console.log("Not found");
//         }
//       } else {
//         console.log("Wrong path!!");
//       }
//     } catch (error) {
//       console.error('Error fetching game data:', error);
//     }
//   };

//   const [userScore, setUserScore] = useState(0);
//   const [teamScore, setTeamScore] = useState<number>(0);
  
//   const toast = useToast();
//   const navigate = useNavigate();
  
//   // State to track if data has been fetched from Firestore
//   const [dataFetched, setDataFetched] = useState(false);
  
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
//   const [optionsDisabled, setOptionsDisabled] = useState(false);  
//   const [questions, setQuestions] = useState<Question[]>([]);
  
//   const [isLastQuestionDisplayed, setIsLastQuestionDisplayed] = useState(false);

//   useEffect(() => {
//     if (currentQuestionIndex === questions.length - 1) {
//       setIsLastQuestionDisplayed(true);
//     } else {
//       setIsLastQuestionDisplayed(false);
//     }
//   }, [currentQuestionIndex, questions]);

//   const currentQuestion = questions[currentQuestionIndex];
//   const isOptionSelected = selectedOption !== null;
//   const isCorrectAnswer =
//     isOptionSelected && currentQuestion?.question_options.L[selectedOption].S === currentQuestion.question_right_answer;
//   const isLastQuestion = currentQuestionIndex === questions.length - 1;

//   const handleOptionClick = (index: number) => {
//     if (!optionsDisabled) {
//       if (currentQuestion.question_options.L[index].S === currentQuestion.question_right_answer) {
//         // If the selected option is correct, increment the user's score and the team score
//         setUserScore((prevUserScore) => prevUserScore + 1);
//         setTeamScore((prevTeamScore) => prevTeamScore + 1);
//       }
//       setSelectedOption(index);
//       setOptionsDisabled(true);
//     }
//   };

//   // Function to make the API call
//   const fetchData = async () => {
//     try {
//       const response = await fetch('https://76zhbkbpj1.execute-api.us-east-1.amazonaws.com/prod/assignquestions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ game_name : gameNameFromState }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }else{
//         const responseBody = await response.json();
//         const questions = responseBody.body;

//         console.log("Questions:", questions);
//         setQuestions(questions);
//         // setDataFetched(true);
//       }

//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleNextClick = () => {
//     setSelectedOption(null);
//     setOptionsDisabled(false);
//     if (currentQuestionIndex === questions.length - 1) {
//       return;
//     }
//     setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
//   };

//   const handleFinishClick = () => {
//     toast({
//       title: 'Cannot Finish Yet!',
//       description: 'Please answer all questions before finishing the quiz.',
//       status: 'warning',
//       duration: 5000,
//       isClosable: true,
//     });
//   };
  
//   return (
//     <ChakraProvider>
//       <Center h="100vh">
//         <Box maxW="xl">
//           <Box position="absolute" top={80} left={4} fontSize="xl">
//             Current Score: {userScore}
//           </Box>
//           <Box position="absolute" top={36} left={4} fontSize="xl">
//             Team Score: {teamScore}
//           </Box>
//           <Box position="absolute" top={4} right={4} fontSize="xl">
//             Time Frame: {gameTimeFrame}
//           </Box>
//           {currentQuestion ? (
//             <Box borderWidth={2} borderRadius="lg" borderColor={isOptionSelected ? (isCorrectAnswer ? 'green' : 'red') : 'black'} p={8}>
//               <Heading mb={4}>Question {currentQuestionIndex + 1}</Heading>
//               <Text fontSize="xl" mb={4}>
//                 {currentQuestion.question_name}
//               </Text>
//               {currentQuestion.question_options.L.map((option, index) => (
//                 <Card
//                   key={index}
//                   onClick={() => handleOptionClick(index)}
//                   bg={
//                     optionsDisabled
//                       ? option.S === currentQuestion.question_right_answer
//                         ? 'green'
//                         : selectedOption === index
//                         ? 'red'
//                         : 'inherit'
//                       : 'inherit'
//                   }
//                   p={4}
//                   borderRadius="md"
//                   cursor={optionsDisabled ? 'not-allowed' : 'pointer'}
//                   mb={2}
//                 >
//                   <Text fontSize="lg">{option.S}</Text>
//                 </Card>
//               ))}
//             </Box>
//           ) : (
//             <Text fontSize="xl">Loading questions...</Text>
//           )}
//           {!isLastQuestionDisplayed && (
//             <Button onClick={handleNextClick} mt={4} colorScheme="blue" isDisabled={!isOptionSelected}>
//               Next
//             </Button>
//           )}
//           {isLastQuestionDisplayed && (
//             <Button onClick={handleFinishClick} mt={4} colorScheme="green" isDisabled={!isOptionSelected}>
//               Finish
//             </Button>
//           )}
//         </Box>
//       </Center>
//     </ChakraProvider>
//   );
// };

// export default Temp;

import React, { useState, useEffect } from 'react';
import { Box, Button, Card, Center, ChakraProvider, Heading, Text, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useHistory hook
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, setDoc, addDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';

interface GameData {
  game_name: string;
  gameDifficultyLevel: string;
  gameTimeFrame: string;
  gameCategory: string;
}

interface Question {
  question_name: string;
  question_options: {
    L: { S: string }[];
  };
  question_right_answer: string;
}

interface TeamData {
  team_name: string;
  userEmail?: string[];
}

const firebaseConfig = {
  apiKey: "AIzaSyBzD6iYIqdaFWr-UYiR7AI12TEdY235sR0",
  authDomain: "serverlesssdp3.firebaseapp.com",
  projectId: "serverlesssdp3",
  storageBucket: "serverlesssdp3.appspot.com",
  messagingSenderId: "248193786486",
  appId: "1:248193786486:web:28b88f1458d87328177557",
  measurementId: "G-8G72EE3EJN"
};

const TIMER_KEY = 'quiz_timer';

const Temp = () => {

  const location = useLocation();

  const gameNameFromState = location.state.gameName;
  console.log(gameNameFromState);
  console.log(typeof gameNameFromState);

  const teamNameFromState = location.state.teamName;
  console.log(teamNameFromState);
  console.log(typeof teamNameFromState);

  // Making a temp list of users
  const teamMembersList : string[] = [
    'test1@gmail.com',
    'test2@gmail.com',
  ];

  const toast = useToast();
  const navigate = useNavigate();

  // Initialize the gameTimeFrame state using localStorage or fetch from API
  const [gameTimeFrame, setGameTimeFrame] = useState<number | null>(() => {
    // Check if the gameTimeFrame already exists in localStorage
    const storedTimeFrame = localStorage.getItem(TIMER_KEY);
    if (storedTimeFrame) {
      return Number(storedTimeFrame);
    } else {
      return null;
    }
  });

  const [data, setData] = useState<string|null>(null);

  useEffect(() => {
    const fetchGameTimeFrameResponse = async () => {
      try {
        const response = await fetch('https://w3r49v036h.execute-api.us-east-1.amazonaws.com/prod/getgames');
        const data = await response.json();

        // Check if data is an array before setting it to state
        if (typeof data === "object" && !Array.isArray(data)) {
          const dataArray = Object.values(data['body']);

          const gameDataFromResponse : any = dataArray.find((game:any) => game.game_name === gameNameFromState);

          if (gameDataFromResponse){
            const timeFrame = gameDataFromResponse.gameTimeFrame;
            const parsedTimeFrame = Number(timeFrame.replace(/\D/g, ''));
            setGameTimeFrame(parsedTimeFrame);
          }else{
            console.log("Not found");
          }
        } else {
          console.log("Wrong path!!");
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchGameTimeFrameResponse();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('persist:root');
    if (userData) {
      const parsedData = JSON.parse(userData);
      console.log(parsedData['user']);

      const userEmailId = parsedData['user'];
      if (teamMembersList.includes(userEmailId)){
        setData(userEmailId);
        console.log("user is present : ",userEmailId);
      }else{
        console.log("not logged in yet");
      }
    }else{
      console.log("wrong data");
    }
  }, []);

  // State to track if data has been fetched from Firestore
  const [dataFetched, setDataFetched] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [isLastQuestionDisplayed, setIsLastQuestionDisplayed] = useState(false);

  useEffect(() => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsLastQuestionDisplayed(true);
    } else {
      setIsLastQuestionDisplayed(false);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    initializeApp(firebaseConfig);
    fetchData();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isOptionSelected = selectedOption !== null;
  const isCorrectAnswer =
    isOptionSelected && currentQuestion?.question_options.L[selectedOption].S === currentQuestion.question_right_answer;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Function to update the user score and team score in Firestore
  const updateScoresInFirestore = async () => {
    try {
      const firestore = getFirestore();
      const gameScoreRef = doc(firestore, 'gameScore', 'gameDetails');

      // Fetch the existing game details from the database
      const gameScoreSnapshot = await getDoc(gameScoreRef);
      const existingGameDetails = gameScoreSnapshot.exists() ? gameScoreSnapshot.data() : {};

      const teamName = teamNameFromState;
      const userEmail = data;

      // Check if the team details exists in the existing game details
      const teamDetails = existingGameDetails?.teamDetails || {};
      const teamScores = teamDetails.gameScores || [];

      // Find the index of the user's email in the teamScores array
      const userIndex = teamScores.findIndex((user: any) => user.userEmail === userEmail);

      if (userIndex !== -1) {
        // If the user's email exists, update the score for that user
        teamScores[userIndex].userScore = userScore;
      } else {
        // If the user's email doesn't exist, add a new entry for the user
        teamScores.push({ userEmail, userScore });
      }

      // Calculate the team score by summing up the user scores
      const updatedTeamScore = teamScores.reduce((totalScore: number, user: any) => totalScore + user.userScore, 0);

      // Update the team score in the teamDetails
      teamDetails.teamName = teamName;
      teamDetails.gameScores = teamScores;
      teamDetails.teamScore = updatedTeamScore;
      teamDetails.gameName = gameNameFromState;

      // Update the game details in the database
      const updatedGameDetails = {
        ...existingGameDetails,
        teamDetails,
      };

      await setDoc(gameScoreRef, updatedGameDetails);
    } catch (error) {
      console.error('Error updating user and team scores:', error);
    }
  };

  const handleOptionClick = (index: number) => {
    if (!optionsDisabled) {
      if (currentQuestion.question_options.L[index].S === currentQuestion.question_right_answer) {
        // If the selected option is correct, increment the user's score and the team score
        setUserScore((prevUserScore) => prevUserScore + 1);
        setTeamScore((prevTeamScore) => prevTeamScore + 1);

        if (data) {
          updateScoresInFirestore();
        }

      }
      setSelectedOption(index);
      setOptionsDisabled(true);
    }
  };

  // Function to make the API call
  const fetchData = async () => {
    try {
      const response = await fetch('https://76zhbkbpj1.execute-api.us-east-1.amazonaws.com/prod/assignquestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game_name : gameNameFromState }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        const responseBody = await response.json();
        const questions = responseBody.body;

        console.log("Questions:", questions);
        setQuestions(questions);
        // setDataFetched(true);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [userScore, setUserScore] = useState(0);
  const [teamScore, setTeamScore] = useState<number>(0);

  const handleNextClick = () => {
    setSelectedOption(null);
    setOptionsDisabled(false);
    if (currentQuestionIndex === questions.length - 1) {
      return;
    }
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  const handleFinishClick = () => {
    toast({
      title: 'Cannot Finish Yet!',
      description: 'Please answer all questions before finishing the quiz.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider>
      <Center h="100vh">
        <Box maxW="xl">
          <Box position="absolute" top={80} left={4} fontSize="xl">
            Current Score: {userScore}
          </Box>
          <Box position="absolute" top={36} left={4} fontSize="xl">
            Team Score: {teamScore}
          </Box>
          <Box position="absolute" top={4} right={4} fontSize="xl">
            Time Frame: {gameTimeFrame}
          </Box>
          {currentQuestion ? (
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
          {!isLastQuestionDisplayed && (
            <Button onClick={handleNextClick} mt={4} colorScheme="blue" isDisabled={!isOptionSelected}>
              Next
            </Button>
          )}
          {isLastQuestionDisplayed && (
            <Button onClick={handleFinishClick} mt={4} colorScheme="green" isDisabled={!isOptionSelected}>
              Finish
            </Button>
          )}
        </Box>
      </Center>
    </ChakraProvider>
  );
};

export default Temp;
