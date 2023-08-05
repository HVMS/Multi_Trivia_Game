
import { useLocation, useNavigate } from 'react-router-dom';
import { ChakraProvider, Text } from '@chakra-ui/react'
import { Card } from 'react-bootstrap';
import { getRemainingTimeInSeconds } from '../../../services/utils';
import { useEffect, useState } from 'react';


const Wait = () => {

    const { search } = useLocation();
    const naviagate = useNavigate();
    const queryParams = search.replace("?", "").split("&&");
    const startTime = queryParams[0].split("=")[1]
    const gameName = queryParams[1].split("=")[1]
    const teamName = queryParams[2].split("=")[1]

    const [timeLeft, setTimeLeft] = useState(getRemainingTimeInSeconds(startTime));

    useEffect(() => {
        if (timeLeft > 0) {
            if (timeLeft === 1) {
                naviagate('/gaming_experience', { state: { gameName, teamName } })
            }
            setTimeout(() => {
                setTimeLeft((current) => current - 1);
            }, 1000);
        }
    }, [timeLeft]);

    return (<ChakraProvider><div className="d-flex align-items-center justify-content-center w-100" style={{ height: "calc(100vh - 40px)", display: "flex", alignItems: "center", justifyContent: "center" }}>

        <Card className='p-4'>
            <Text fontSize="6xl">Time Left</Text>
            <Text fontSize="6xl" textAlign="center">{timeLeft}</Text>

        </Card>

    </div></ ChakraProvider>)
}

export default Wait