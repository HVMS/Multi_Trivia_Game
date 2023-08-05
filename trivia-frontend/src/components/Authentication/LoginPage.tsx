import React, { useState } from 'react';
import auth from '../../services/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate,Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleLogin = async (event: any) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // You can now redirect the user to the desired page upon successful login
      navigate('/security-questions', { state: { email } });// Replace '/dashboard' with the actual page you want to redirect to
    } catch (error) {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/dashboard'); // Replace '/dashboard' with the actual page you want to redirect to after Google login
    } catch (error: any) {
      console.log('Error signing in with Google:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '30%', backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>User Login</h2>
        <form onSubmit={handleLogin}>
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
              Login
            </button>
            <button
              type="button"
              onClick={handleLoginWithGoogle}
              style={{
                backgroundColor: '#4285F4',
                color: '#FFFFFF',
                fontSize: '16px',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
            >
              Login with Google
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
