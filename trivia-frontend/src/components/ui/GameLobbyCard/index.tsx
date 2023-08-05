import { Card, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, ButtonGroup, Button, Flex, Box } from '@chakra-ui/react';
import { shootInvition } from '../../../services/utils';
import {useNavigate} from 'react-router-dom'


const GameLobbyCard = (props: any) => {

    const {
        gameName,
        difficultyLevel,
        timeframe,
        categories
    } = props;

    const navigate = useNavigate()

    const teamName = "TheWizards"
    const handleClick = async () => {
        const DATE = Date.now() + 1 * 60 * 1000;
        const host = "http://localhost:3000"
        const path = `/game-lobby/wait?startTime=${DATE}&&gameName=${gameName.replace(" ", "")}&&teamName=${teamName}`;
        shootInvition(host+path);
        navigate(path)
    }

    return (
        <>

            <Card maxW='sm'>
                <CardBody>
                    <Image
                        src={`https://picsum.photos/344/230?random=${Math.random()}`}
                        alt='Game'
                        borderRadius='lg'
                    />
                    <Stack mt='4' spacing='3'>
                        <Heading size='md'>{gameName}</Heading>
                        <Text color='teal' fontSize='md'>
                            {categories}
                        </Text>
                    </Stack>
                    <Flex mt="3" align="center" justify="space-between">
                        <Box>
                            <Text color='teal' fontSize='md'>
                                LEVEL: {(difficultyLevel as string).toUpperCase()}
                            </Text>
                        </Box>
                        <Box>
                            <Text color='teal' fontSize='md'>
                                TIME: {timeframe} minutes
                            </Text>
                        </Box>
                    </Flex>
                </CardBody>
                <Divider />
                <CardFooter>
                    <ButtonGroup spacing='2'>
                        <Button variant='solid' colorScheme='teal' onClick={handleClick} >
                            Play now
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    )
}


export default GameLobbyCard;