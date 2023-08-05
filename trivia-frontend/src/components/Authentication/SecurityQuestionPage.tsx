import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../redux/userSlice';
import { shootNotification } from '../../services/utils';

const SecurityQuestionPage = () => {
  const [email, setEmail] = useState('');
  const [securityQuestion1, setSecurityQuestion1] = useState('');
  const [securityQuestion2, setSecurityQuestion2] = useState('');
  const [securityQuestion3, setSecurityQuestion3] = useState('');
  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityAnswer2, setSecurityAnswer2] = useState('');
  const [securityAnswer3, setSecurityAnswer3] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState({} as any);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Destructure the email from the state passed during navigation
  const { email: userEmail } = location.state;

  // Fetch security questions and answers from the API
  useEffect(() => {
    const apiUrl = 'https://ni3yrn85vl.execute-api.us-east-1.amazonaws.com/test/question/'; // Replace with your actual API URL

    axios.post(apiUrl, { email: userEmail })
      .then(response => {
        const { email, security_question1, security_question2, security_question3, security_answer1, security_answer2, security_answer3 } = response.data.body;
        setEmail(email);
        setSecurityQuestion1(security_question1);
        setSecurityQuestion2(security_question2);
        setSecurityQuestion3(security_question3);
        setSecurityQuestions({ security_answer1, security_answer2, security_answer3 });
      })
      .catch(error => {
        console.error('Error fetching security questions:', error);
      });
  }, []);

  // Handle form submission and verify answers
  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    // Compare answers with provided answers
    const isAnswersCorrect = (
      securityAnswer1 === securityQuestions.security_answer1 &&
      securityAnswer2 === securityQuestions.security_answer2 &&
      securityAnswer3 === securityQuestions.security_answer3
    );

    if (isAnswersCorrect) {
      // Redirect to dashboard
      dispatch(
        login({
          email: email
        })
      )
      localStorage.setItem('email', email);
      await shootNotification("PUSH", `Welcome Back, ${email}`);
      navigate('/game-lobby');
    } else {
      alert('Incorrect answers. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '50%', backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>Security Questions</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Email:</label>
            <input
              type="email"
              value={email}
              disabled
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{securityQuestion1}</label>
            <input
              type="text"
              value={securityAnswer1}
              onChange={(e) => setSecurityAnswer1(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{securityQuestion2}</label>
            <input
              type="text"
              value={securityAnswer2}
              onChange={(e) => setSecurityAnswer2(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{securityQuestion3}</label>
            <input
              type="text"
              value={securityAnswer3}
              onChange={(e) => setSecurityAnswer3(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                fontSize: '16px',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Submit Answers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityQuestionPage;
