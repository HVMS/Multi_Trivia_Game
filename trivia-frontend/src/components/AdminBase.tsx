import { Box, Button, ChakraProvider, Flex, Heading, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Td} from "@chakra-ui/react"
import { Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { type } from "os";

interface Game {
    id: number;
    game_name: string;
    gameCategory: string;
    gameDifficultyLevel: string;
    gameTimeFrame: string;
  }

// Define game categories, difficulty levels, and time frames
const categories = ["science", "cricket", "music", "sports", "history"];
const difficultyLevels = ["Easy", "Medium", "Hard"];
const timeFrames = ["60 seconds", "90 seconds", "120 seconds"];

const AdminBase = () => {

  const toast = useToast();

  const navigate = useNavigate();
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedDifficulty, setUpdatedDifficulty] = useState('');
  const [updatedTimeFrame, setUpdatedTimeFrame] = useState('');

  useEffect(() => {
    // Fetch data from the API and set the state
    fetchGamesList();
  }, []);

  const fetchGamesList = async () => {
    try {
      const response = await fetch('https://w3r49v036h.execute-api.us-east-1.amazonaws.com/prod/getgames');
      const data = await response.json();
      
      // Check if data is an array before setting it to state
      if (typeof data === "object" && !Array.isArray(data)) {
        const dataArray: Game[] = Object.values(data['body']);
        setGamesList(dataArray);
      } else {
        setGamesList([]); // If not an array, set an empty array
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching game data:', error);
      setIsLoading(false);
    }
  };

  const handleAddGameClick = () => {
    navigate("/createGame");
  };

  const handleDeleteGame = async (gameName: string) => {
    try {
      // Make the DELETE API call to delete the game record
      const response = await fetch('https://w3r49v036h.execute-api.us-east-1.amazonaws.com/prod/deletegame', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game_name: gameName })
      });

      console.log("Response is : ", response);

      // If the API call is successful, update the gamesList state to remove the deleted game
      if (response.status === 200) {
        setGamesList((prevGamesList) => prevGamesList.filter((game) => game.game_name !== gameName));

        toast({
          title: "Success",
          description: "Congrats!! Successfully Game has been deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

      }else{
        console.log("Something went wrong...please check");

        toast({
          title: "Error",
          description: "Something went wrong...please check",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting game:', error);

      toast({
        title: "Error",
        description: "Something went wrong...please check",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Update the game data code:
  const handleUpdateGame = (game: Game) => {
    setSelectedGame(game);
    setUpdatedCategory(game.gameCategory);
    setUpdatedDifficulty(game.gameDifficultyLevel);
    setUpdatedTimeFrame(game.gameTimeFrame);
    setIsModalOpen(true);
  };

  const handleSaveUpdate = async () => {
    try {
      
      if (!selectedGame) {
        return;
      }

      const game_details = {
        game_name: selectedGame?.game_name,
        gameCategory: updatedCategory,
        gameDifficultyLevel: updatedDifficulty,
        gameTimeFrame: updatedTimeFrame
      }

      console.log("Selected game is : ",selectedGame);
      console.log("updated game details is : ",game_details);

      // Make the PUT API call to update the game record
      const response = await fetch('https://w3r49v036h.execute-api.us-east-1.amazonaws.com/prod/updategamedetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({game_details}),
      });

      console.log("Update API response", response);

      // If the API call is successful, show a success toast message
      if (response.status === 200) {
        setSelectedGame(null);
        setSelectedCategory('');
        setSelectedDifficulty('');
        setSelectedTimeFrame('');
        setIsModalOpen(false);

        fetchGamesList();

        toast({
          title: 'Success',
          description: 'Game updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // If the API call fails, show an error toast message
        toast({
          title: 'Error',
          description: 'Something went wrong...please check.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating game:', error);

      // Show an error toast message if an error occurs
      toast({
        title: 'Error',
        description: 'Something went wrong...please check.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
        <Box>
            <Flex align="center" justify="space-between" padding="20px">
                {/* Left-hand side */}
                <Box>
                    <Heading as="h2" size="lg">
                        Games List
                    </Heading>
                </Box>

                {/* Right-hand side */}
                <Box>
                    <Button colorScheme="teal" size="md" onClick={handleAddGameClick}>
                        Add Game
                    </Button>
                </Box>
            </Flex>

            <Box padding="20px">
                {
                isLoading ? (
                    <Heading as="h3" size="md">
                    Loading...
                    </Heading>
                ) :gamesList.length === 0 ? (
                <Heading as="h3" size="md">
                    No Games created yet.
                </Heading>
                ) : (
                <Table variant="simple" colorScheme="teal">
                    <Thead>
                    <Tr>
                        <Th>Game Name</Th>
                        <Th>Game Category</Th>
                        <Th>Game Difficulty level</Th>
                        <Th>Game Time frame</Th>
                        <Th>Action</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {gamesList.map((game) => (
                        <Tr key={game.id}>
                        <Td fontWeight={"extrabold"}>{game.game_name}</Td>
                        <Td>{game.gameCategory}</Td>
                        <Td>{game.gameDifficultyLevel}</Td>
                        <Td>{game.gameTimeFrame}</Td>
                        <Td>
                            <Button colorScheme="teal" size="sm" mr={2} onClick={() => handleUpdateGame(game)}>
                                Update
                            </Button>
                            <Button colorScheme="red" size="sm" mr={2} onClick={() => handleDeleteGame(game.game_name)}>
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

        {/* Game Update Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Game</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Game Name</FormLabel>
                <Input value={selectedGame?.game_name} disabled />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Game Category</FormLabel>
                <Select value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Game Difficulty Level</FormLabel>
                <Select value={updatedDifficulty} onChange={(e) => setUpdatedDifficulty(e.target.value)}>
                  {difficultyLevels.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Game Time Frame</FormLabel>
                <Select value={updatedTimeFrame} onChange={(e) => setUpdatedTimeFrame(e.target.value)}>
                  {timeFrames.map((timeFrame) => (
                    <option key={timeFrame} value={timeFrame}>
                      {timeFrame}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSaveUpdate}>
                Save
              </Button>
              <Button colorScheme="gray" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
    </ChakraProvider>
    
  );
};

export default AdminBase;