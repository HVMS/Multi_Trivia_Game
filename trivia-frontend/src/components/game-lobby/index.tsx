import {
    Box,
    Button,
    ChakraProvider,
    Flex,
    Heading,
    Grid,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    Stack,
    Input,
    Select
} from "@chakra-ui/react";
import GameLobbyCard from "../ui/GameLobbyCard";
import React, { useEffect, useState } from "react";
import { getData } from "../../services/utils";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameLobby = (props: any) => {
    // const socket = new WebSocket("wss://0rs2czib7e.execute-api.us-east-1.amazonaws.com/production");
    const socket = new WebSocket("INVALID");
    const [filterData, setFilterData] = useState([] as any);
    const notify = (message: any) => toast.success(message);

    const filterClickHandler = async (popoverData: any) => {
        fetchGameData(popoverData)
    }
    const generateGetTriviaGamesURL = (filterData: any) => {
        const baseURL = "https://us-central1-serverless-392821.cloudfunctions.net/triviaGameLobby";
        const queryParams = [];

        if (filterData.category && filterData.category != '') {
            queryParams.push(`category=${encodeURIComponent(filterData.category)}`);
        }
        if (filterData.difficultyLevel && filterData.difficultyLevel != '') {
            let difficultyLevel;
            switch (filterData.difficultyLevel) {
                case "EASY":
                    difficultyLevel = 1;
                    break;
                case "MEDIUM":
                    difficultyLevel = 2;
                    break;
                case "HARD":
                    difficultyLevel = 3;
                    break;
                default:
                    difficultyLevel = 1;
                    break;
            }
            queryParams.push(`difficulty=${encodeURIComponent(difficultyLevel)}`);
        }
        if (filterData.timeframe && filterData.timeframe != 0) {
            queryParams.push(`timeframe=${encodeURIComponent(filterData.timeframe)}`);
        }
        if (queryParams.length > 0) {
            return `${baseURL}?${queryParams.join("&")}`;
        } else {
            return baseURL;
        }
    }

    const fetchGameData = async (filterData: any) => {
        const url = generateGetTriviaGamesURL(filterData);
        const response = await getData(url);
        if (response?.status === 200) {
            setFilterData(response?.data);
        }
    }

    useEffect(() => {
        fetchGameData({});
    }, []);

    useEffect(() => {
        socket.onopen = () => socket.send(JSON.stringify({ "action": "getNotifications" }));
        socket.onmessage = (event) => {
            console.log("EVENT===>", event);
            const data = JSON.parse(event.data);
            if (data.output !== undefined || data.output !== "") {
                notify(data.output);
            }
        }
    }, [socket.onmessage])

    return (
        <ChakraProvider>
            <Box>
                <Flex align="center" justify="space-between" padding="20px">
                    <Box>
                        <Heading as="h2" size="lg">
                            Game lobby
                        </Heading>
                    </Box>
                    <Box>
                        <FilterPopover filterClickHandler={filterClickHandler} />
                    </Box>
                </Flex>

                <Box padding="20px">
                    {filterData && filterData.length > 0 ? (
                        <Grid templateColumns='repeat(4, 1fr)' gap={6}>
                            {filterData.map((game: any, idx: any) => (
                                <GameLobbyCard key={idx} gameName={game.game_name} difficultyLevel={game.difficulty_level} timeframe={game.timeframe} categories={(game.categories as string[]).toString()} />
                            ))}
                        </Grid>
                    ) : (
                        <Heading as="h3" size="md">
                            No Games available.
                        </Heading>
                    )}

                </Box>
            </Box>            
        </ChakraProvider>
    )
}

export default GameLobby;

const FilterPopover = (props: any) => {
    const {
        filterClickHandler
    } = props;
    const initRef = React.useRef();
    const [category, setCategory] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("");
    const [timeframe, setTimeframe] = useState(0);

    const handleCategoriesChange = (e: any) => {
        setCategory(e.target.value);
    }

    const handleDifficultyLevelChange = (e: any) => {
        setDifficultyLevel(e.target.value);
    }

    const handleTimeframeChange = (e: any) => {
        setTimeframe(e.target.value);
    }
    const filterApplyHandler = (onClose: any) => {
        const data = {
            category: category,
            difficultyLevel: difficultyLevel,
            timeframe: timeframe
        };
        filterClickHandler(data);
        onClose();
    }
    return (
        <Popover closeOnBlur={false} placement='bottom'>
            {({ isOpen, onClose }) => (
                <>
                    <PopoverTrigger>
                        <Button colorScheme="teal" size="md">Filter</Button>
                    </PopoverTrigger>
                    <Portal>
                        <PopoverContent>
                            <PopoverHeader>Apply filter as required</PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody>
                                <Box>
                                    <Stack spacing={4}>
                                        <Select placeholder='Categories' onChange={handleCategoriesChange}>
                                            <option value='Sports'>Sports</option>
                                            <option value='Movies'>Movies</option>
                                            <option value='Education'>Education</option>
                                        </Select>
                                        <Select placeholder='Difficulty Level' onChange={handleDifficultyLevelChange}>
                                            <option value='EASY'>EASY</option>
                                            <option value='MEDIUM'>MEDIUM</option>
                                            <option value='HARD'>HARD</option>
                                        </Select>
                                        <Input type="number" placeholder='Maximum length (minutes)' size='md' onChange={handleTimeframeChange} />
                                    </Stack>
                                </Box>
                                <Button
                                    mt={4}
                                    colorScheme="teal"
                                    size="md"
                                    onClick={() => { filterApplyHandler(onClose) }}
                                >
                                    Apply
                                </Button>
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </>
            )}
        </Popover>
    )
}