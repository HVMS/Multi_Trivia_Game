import { useState } from "react";
import {
    ChakraProvider,
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    useToast,
  } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Define game categories, difficulty levels, and time frames
const categories = ["science", "cricket", "music", "sports", "history"];
const difficultyLevels = ["Easy", "Medium", "Hard"];
const timeFrames = ["120 seconds", "180 seconds", "240 seconds"];

// Define the type for the game data
interface GameData {
    gameName: string;
    category: string;
    difficulty: string;
    timeFrame: string;
  }

const GameCreatePage = () => {

    const toast = useToast();
    const [gameName, setGameName] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [timeFrame, setTimeFrame] = useState("");

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        gameName: "",
        category: "",
        difficulty: "",
        timeFrame: "",
      });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "gameName") {
          setGameName(value);
          setErrors((prevErrors) => ({ ...prevErrors, gameName: "" }));
        } else if (name === "category") {
          setCategory(value);
          setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
        } else if (name === "difficulty") {
          setDifficulty(value);
          setErrors((prevErrors) => ({ ...prevErrors, difficulty: "" }));
        } else if (name === "timeFrame") {
          setTimeFrame(value);
          setErrors((prevErrors) => ({ ...prevErrors, timeFrame: "" }));
        }
      };

      const sendGameData = async (data: GameData) => {
        try {
          const response = await fetch('https://w3r49v036h.execute-api.us-east-1.amazonaws.com/prod/addgame', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
          });

          const responseData = await response.json();

          console.log(responseData);
    
          if (responseData.statusCode === 200) {
            // Successful API call, perform further actions if needed
            console.log('Successfully created the game...');

            // Show Success message
            toast({
                title: "Success",
                description: "Congrats!! Successfully Game has been created.",
                status: "success",
                duration: 2000,
                isClosable: true,
              });

            // Reset the form fields
            setGameName('');
            setCategory('');
            setDifficulty('');
            setTimeFrame('');
            setErrors({
              gameName: "",
              category: "",
              difficulty: "",
              timeFrame: "",
            });

            // Navigate to another page if only success!!
            navigate('/admin')

          } else if (responseData.statusCode === 409){
            // Successful API call, perform further actions if needed
            console.log('The Game name you created is already exists...');

            // Show Error message
            toast({
                title: "Error",
                description: "Ops!! Game name already exists.",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
          } else {
            // Error occurred while sending the data
            console.error('Error sending game data:', responseData.statusCode);
          }
        } catch (error) {
          console.error('Error sending game data:', error);
        }
      };

    const handleSubmit = async () => {
        const newErrors = {
            gameName: gameName ? "" : "Game Name is required",
            category: category ? "" : "Game Category is required",
            difficulty: difficulty ? "" : "Difficulty Level is required",
            timeFrame: timeFrame ? "" : "Time Frame is required",
          };

          if (!gameName || !category || !difficulty || !timeFrame) {
            setErrors(newErrors);
            return;
          }

        // Validate Time Frame
        if (!timeFrames.includes(timeFrame)) {
            setErrors((prevErrors) => ({
            ...prevErrors,
            timeFrame: "Invalid Time Frame",
            }));
            return;
        }

        try {
            // Prepare the data to be sent
            const data = {
                gameName,
                category,
                difficulty,
                timeFrame
            };

            sendGameData(data);

          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to upload game data. Please try again later.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
    };

    return(
        <ChakraProvider>
            <Box width="100%" maxWidth="400px" margin="0 auto">
                <FormControl mb="3">
                    <FormLabel>Game Name</FormLabel>
                    <Input
                    type="text"
                    name="gameName"
                    value={gameName}
                    onChange={handleChange}
                    placeholder="Enter game name"
                    />
                    {errors.gameName && <Box color="red">{errors.gameName}</Box>}
                </FormControl>
                <FormControl mb="3">
                    <FormLabel>Game Category</FormLabel>
                    <Select
                    name="category"
                    value={category}
                    onChange={handleChange}
                    placeholder="Select category"
                    >
                    <option value=""></option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                        {category}
                        </option>
                    ))}
                    </Select>
                    {errors.category && <Box color="red">{errors.category}</Box>}
                </FormControl>
                <FormControl mb="3">
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select
                    name="difficulty"
                    value={difficulty}
                    onChange={handleChange}
                    placeholder="Select difficulty level"
                    >
                    <option value=""></option>
                    {difficultyLevels.map((level) => (
                        <option key={level} value={level}>
                        {level}
                        </option>
                    ))}
                    </Select>
                    {errors.difficulty && <Box color="red">{errors.difficulty}</Box>}
                </FormControl>
                <FormControl mb="3">
                    <FormLabel>Time Frame</FormLabel>
                    <Select
                    name="timeFrame"
                    value={timeFrame}
                    onChange={handleChange}
                    placeholder="Select time frame"
                    >
                    <option value=""></option>
                    {timeFrames.map((frame) => (
                        <option key={frame} value={frame}>
                        {frame}
                        </option>
                    ))}
                    </Select>
                    {errors.timeFrame && <Box color="red">{errors.timeFrame}</Box>}
                </FormControl>
                <Button colorScheme="green" onClick={handleSubmit}>
                    Create Game
                </Button>
            </Box>
        </ChakraProvider>                
    );
};

export default GameCreatePage;