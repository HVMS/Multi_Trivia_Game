import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import { ChakraProvider, Center, Button} from '@chakra-ui/react';
import AddQuestionPage from './pages/AddQuestionPage';

function App() {

  const HomePage = () => {
    return (
      <Center mt={8}>
        <Button colorScheme="blue" as={Link} to="/addquiz" mr={4}>
          Add Question
        </Button>
        <Button colorScheme="blue" as={Link} to="/editquiz" ml={4}>
          Edit Question
        </Button>
        <Button colorScheme="blue" as={Link} to="/deletequiz" ml={4}>
          Delete Question
        </Button>
      </Center>
    );
  };

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addquiz" element={<AddQuestionPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ChakraProvider>

  );
}

export default App;
