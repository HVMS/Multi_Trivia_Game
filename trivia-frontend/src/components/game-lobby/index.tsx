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
import React, { useEffect, useRef, useState } from "react";
import { getData, postData, shootNotification } from "../../services/utils";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWebSocket from 'react-use-websocket';

const GameLobby = (props: any) => {
    const [filterData, setFilterData] = useState([] as any);
    const [userAllTeamDetails, setUserAllTeamDetails] = useState([] as any);
    const notify = (message: any) => toast.success(message);
    const [selectedTeam, setSelectedTeam] = useState("");

    const handleTeamChange = async (e: any) => {
        setSelectedTeam(e.target.value);
        await shootNotification("PUSH", `Team Changed: ${e.target.value}.`);
    }

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
            queryParams.push(`difficulty=${encodeURIComponent(filterData.difficultyLevel)}`);
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

    const getAllUserTeamDetails = async () => {
        const body = {
            "email": "kushsutaria.99@gmail.com"
        }
        const response = await postData(JSON.stringify(body), "https://k4ru2wkr7a.execute-api.us-east-1.amazonaws.com/prod/fetchTeamNames");
        if (response?.status == 200) {
            const list = response?.data.map((elem: any) => {
                return Object.keys(elem)[0];
            })

            setUserAllTeamDetails(list);
        }
    }

    useEffect(() => {
        getAllUserTeamDetails();
    }, [])

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
                        <Flex align="center" justify="space-between" padding="20px">
                            <Box style={{ marginRight: "60px" }}>
                                <Select placeholder='Select Team' colorScheme="teal" size="md" onChange={handleTeamChange}>
                                    {userAllTeamDetails?.map((data: any, idx: any) => {
                                        return <option key={idx} value={data}>{data}</option>
                                    })}
                                </Select>
                            </Box>
                            <FilterPopover filterData={filterData} filterClickHandler={filterClickHandler} />
                        </Flex>
                    </Box>
                </Flex>

                <Box padding="20px">
                    {filterData && filterData.length > 0 ? (
                        <Grid templateColumns='repeat(4, 1fr)' gap={6}>
                            {filterData.map((game: any, idx: any) => (
                                <GameLobbyCard key={idx} gameName={game.game_name} difficultyLevel={game.gameDifficultyLevel} timeframe={game.gameTimeFrame} categories={game.gameCategory} teamName={selectedTeam} />
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
        filterClickHandler,
        filterData
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
                                            {filterData.map((data: any, idx: any) => {
                                                return <option key={idx} value={data.gameCategory}>{data.gameCategory}</option>
                                            })}
                                        </Select>
                                        <Select placeholder='Difficulty Level' onChange={handleDifficultyLevelChange}>
                                            <option value='Easy'>EASY</option>
                                            <option value='Medium'>MEDIUM</option>
                                            <option value='Hard'>HARD</option>
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