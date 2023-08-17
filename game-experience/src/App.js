import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import { ChakraProvider, Center, Button} from '@chakra-ui/react';
import AddQuestionPage from './pages/AddQuestionPage';
import QuestionBankPage from './pages/QuestionBankPage';

function App() {

  const HomePage = () => {
    return (
      <Center mt={8}>
        <Button colorScheme="blue" as={Link} to="/addquiz" ml={8}>
          Add Question
        </Button>
        <Button colorScheme="blue" as={Link} to="/questions" ml={8}>
          Question Bank
        </Button>
        <Button colorScheme="blue" as={Link} to="/deletequiz" ml={8}>
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
          <Route path="/questions" element={<QuestionBankPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ChakraProvider>

  );
}

export default App;
