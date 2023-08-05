import React, { useState, useEffect } from 'react';
import { Box, Button, Card, Center, ChakraProvider, Heading, Text, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useHistory hook
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { selectUser } from '../../redux/userSlice';
import { initializeApp } from 'firebase/app';
import { getRemainingTimeInSeconds } from '../../services/utils';
import {
  Input,
  InputGroup,
  InputRightElement,
  Stack
} from '@chakra-ui/react';
import { toast as TOAST } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWebSocket from 'react-use-websocket';
import { getFirestore, doc, updateDoc, query, orderBy, setDoc, addDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';

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

const firebaseConfig1 = {
  apiKey: "AIzaSyBzD6iYIqdaFWr-UYiR7AI12TEdY235sR0",
  authDomain: "serverlesssdp3.firebaseapp.com",
  projectId: "serverlesssdp3",
  storageBucket: "serverlesssdp3.appspot.com",
  messagingSenderId: "248193786486",
  appId: "1:248193786486:web:28b88f1458d87328177557",
  measurementId: "G-8G72EE3EJN"
};

initializeApp(firebaseConfig1, "mydb");

const TIMER_KEY = 'quiz_timer';

const Temp = () => {

  const location = useLocation();

  const [userScore, setUserScore] = useState(0);
  const [teamScore, setTeamScore] = useState<number>(0);
  const notify = (message: any) => TOAST.success(message);
  
  const gameNameFromState = location.state.gameName;
  console.log(gameNameFromState);
  console.log(typeof gameNameFromState);

  const teamNameFromState = location.state.teamName;
  console.log("my tema name is : ",teamNameFromState);
  console.log(typeof teamNameFromState);

  // Making a temp list of users
  const teamMembersList : string[] = [
    'test11@gmail.com',
    'test12@gmail.com',
  ];

  const toast = useToast();
  const navigate = useNavigate();

  const [gameTimeFrame, setGameTimeFrame] = useState<number>(0);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
} = useWebSocket("wss://0rs2czib7e.execute-api.us-east-1.amazonaws.com/production", {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => {
        const data = JSON.parse(event.data);
        if (data.output !== undefined || data.output !== "") {
            notify(data.output);
        }
    }
});

useEffect(() => {
    sendMessage(JSON.stringify({ "action": "getNotifications" }));
})

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
            console.log("parsedTimeFrame is : ",parsedTimeFrame);
            setTimeLeft(parsedTimeFrame);
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

  const [timeLeft, setTimeLeft] = useState(getRemainingTimeInSeconds(gameTimeFrame));

  useEffect(() => {
        
    console.log("TIME LEFT===>", timeLeft)
    if (timeLeft > 0) {

      if (timeLeft === 1) {

        navigate('/leaderboard');

      }

      setTimeout(() => {

        setTimeLeft((current) => current - 1);

      }, 1000);

    }

  }, [timeLeft]);

  const reduxData = useSelector(selectUser);
  const userEmailId = reduxData.email;
  console.log("User email id is : ", userEmailId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [isLastQuestionDisplayed, setIsLastQuestionDisplayed] = useState(false);

  // State to hold the team details from Firestore
  const [teamDetails, setTeamDetails] = useState<any>({});

  useEffect(() => {
    // Fetch and subscribe to the team details in Firestore
    const firestore = getFirestore();
    const gameScoreRef = doc(firestore, 'gameScore', 'gameDetails');

    // Subscribe to changes in the team details
    const unsubscribe = onSnapshot(gameScoreRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const gameDetails = docSnapshot.data();
        if (gameDetails && gameDetails.teamDetails) {
          // Update the team details state with real-time data
          setTeamDetails(gameDetails.teamDetails);
          console.log("Team details : ", teamDetails);
        }
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsLastQuestionDisplayed(true);
    } else {
      setIsLastQuestionDisplayed(false);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    fetchData();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isOptionSelected = selectedOption !== null;
  const isCorrectAnswer =
    isOptionSelected && currentQuestion?.question_options.L[selectedOption].S === currentQuestion.question_right_answer;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Function to update the user score and team score in Firestore
  const updateScoresInFirestore = async (teamScore: number, userScore: number) => {
    try {
      const firestore = getFirestore();
      const gameScoreRef = doc(firestore, 'gameScore', 'gameDetails');

      // Fetch the existing game details from the database
      const gameScoreSnapshot = await getDoc(gameScoreRef);
      const existingGameDetails = gameScoreSnapshot.exists() ? gameScoreSnapshot.data() : {};

      const teamName = teamNameFromState;
      const userEmail = userEmailId;

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
        const selectedOptionValue = currentQuestion.question_options.L[index].S;
        const rightAnswer = currentQuestion.question_right_answer;

        const isCorrectOption = selectedOptionValue === rightAnswer;

        const newUserScore = userScore + (isCorrectOption ? 1 : 0);
        const newTeamScore = teamScore + (isCorrectOption ? 1 : 0);

        setUserScore(newUserScore);

        setTeamScore(newTeamScore);

        console.log("My data is : ",userEmailId);

        if (userEmailId) {
          console.log(newTeamScore + " " +newUserScore);
          updateScoresInFirestore(newTeamScore, newUserScore);
        }

      }
      setSelectedOption(index);
      setOptionsDisabled(true);
    }
  };

  // Function to make the API call
  const fetchData = async () => {
    try {
      const response = await fetch('https://8b9cead42j.execute-api.us-east-1.amazonaws.com/prod/getquestions', {
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

  const [chatMessage, setChatMessage] = useState<string>('');

  const [chatMessages, setChatMessages] = useState<{ userEmail: string; message: string }[]>([]);

  useEffect(() => {

    // Fetch and subscribe to the chat messages in Firestore
    const firestore = getFirestore();
    const gameChatCollectionRef = collection(firestore, 'mychat', gameNameFromState, 'chatMessages');

    // Create a query to order the messages by their timestamp
    const chatQuery = query(gameChatCollectionRef, orderBy('timestamp'));

    // Subscribe to changes in the chat messages
    const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
      const messages: { userEmail: string; message: string }[] = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        messages.push({ userEmail: messageData.userEmail, message: messageData.message });
      });
    
      // Update the chat messages state with real-time data
      setChatMessages(messages);
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [gameNameFromState]);

  // Function to send a chat message
  const sendChatMessage = async () => {
    if (chatMessage.trim() !== '') {
      try {
        const firestore = getFirestore();
        const gameChatCollectionRef = collection(firestore, 'mychat', gameNameFromState, 'chatMessages');

        // Get the user's email from the parsed data
        console.log("email id is : ",userEmailId);
        const userEmail = userEmailId;

        // Create a new chat message document in Firestore
        await addDoc(gameChatCollectionRef, {
          userEmail: userEmail,
          message: chatMessage,
          timestamp: new Date().toISOString(),
        });

        // Clear the chat input field after sending the message
        setChatMessage('');
      } catch (error) {
        console.error('Error sending chat message:', error);
      }
    }
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
          <Box position="absolute" top={80} right={4} fontSize="xl">
            Time Frame: {timeLeft} seconds
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
        <Box maxW="xl">
            <Box borderWidth={2} borderRadius="lg" borderColor="black" p={8} mt={8}>
              <Heading mb={4}>Chat Box</Heading>
                <Box maxWidth="450px" maxHeight="350px" overflowY="auto">
                  {chatMessages.map((messageData, index) => (
                    <Card key={index} p={2} mb={2} borderWidth={1}>
                      {/* <Text fontSize="md">{message}</Text> */}
                      <Text fontSize="md">{`${messageData.userEmail}: ${messageData.message}`}</Text>
                    </Card>
                  ))}
                </Box>
              <Stack direction="row" mt={4}>
                <InputGroup>
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message here"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={sendChatMessage}>
                      Send
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Stack>
            </Box>
          </Box>
      </Center>
    </ChakraProvider>
  );
};

export default Temp;
