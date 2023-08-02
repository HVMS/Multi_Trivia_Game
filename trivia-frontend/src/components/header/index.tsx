import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';

const Header = () => {
    const { isOpen, onToggle } = useDisclosure();
    return (
        <Box>
            <h1>HEADER WILL BE HERE</h1>
            <hr/>
        </Box>
    )
}

export default Header;