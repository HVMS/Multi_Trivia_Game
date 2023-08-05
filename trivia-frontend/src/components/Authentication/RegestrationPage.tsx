import React, { useState } from 'react';
import axios from 'axios';
import auth from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { shootNotification } from '../../services/utils';

const Registration = () => {
  const [email, setEmail] = useState('');
  const navigate=useNavigate();
  const [password, setPassword] = useState('');
  const [securityQuestion1, setSecurityQuestion1] = useState('');
  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityQuestion2, setSecurityQuestion2] = useState('');
  const [securityAnswer2, setSecurityAnswer2] = useState('');
  const [securityQuestion3, setSecurityQuestion3] = useState('');
  const [securityAnswer3, setSecurityAnswer3] = useState('');

  const allQuestions = [
    'What is your favorite color?',
    'What is your pet\'s name?',
    'What city were you born in?',
    'What is your mother\'s maiden name?',
    'What is your favorite food?',
  ];

  const handleRegistration = async (event: any) => {
    event.preventDefault();

    // Create the user in Firebase Authentication
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare the data to send to the API
      const userData = {
        email: email,securityQuestion1, securityAnswer1, securityQuestion2,securityAnswer2, securityQuestion3, securityAnswer3
      };

      // Send user data to the API using Axios post request
      const apiUrl = 'https://ni3yrn85vl.execute-api.us-east-1.amazonaws.com/test'; // Replace with your actual API URL
      await axios.post(apiUrl, userData);

      await shootNotification("EMAIL", `Welcome to Trivia Titans, ${userData.email}!`);
      navigate("/login");
    } catch (error) {
      alert("user regestration fail email already exists");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '30%', backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>User Registration</h2>
        <form onSubmit={handleRegistration}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Security Question 1:</label>
            <select
              value={securityQuestion1}
              onChange={(e) => setSecurityQuestion1(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            >
              <option value="">Select a security question</option>
              {allQuestions.map((question, i) => (
                <option key={i} value={question}>
                  {question}
                </option>
              ))}
            </select>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', marginTop: '8px' }}>Security Answer 1:</label>
            <input
              type="text"
              value={securityAnswer1}
              onChange={(e) => setSecurityAnswer1(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Security Question 2:</label>
            <select
              value={securityQuestion2}
              onChange={(e) => setSecurityQuestion2(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            >
              <option value="">Select a security question</option>
              {allQuestions.filter((question) => question !== securityQuestion1).map((question, i) => (
                <option key={i} value={question}>
                  {question}
                </option>
              ))}
            </select>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', marginTop: '8px' }}>Security Answer 2:</label>
            <input
              type="text"
              value={securityAnswer2}
              onChange={(e) => setSecurityAnswer2(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Security Question 3:</label>
            <select
              value={securityQuestion3}
              onChange={(e) => setSecurityQuestion3(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', outline: 'none' }}
              required
            >
              <option value="">Select a security question</option>
              {allQuestions.filter((question) => question !== securityQuestion1 && question !== securityQuestion2).map((question, i) => (
                <option key={i} value={question}>
                  {question}
                </option>
              ))}
            </select>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', marginTop: '8px' }}>Security Answer 3:</label>
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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
