import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import knightLogo from '../knight-logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic here
    navigate('/home'); // Navigate to the map homepage
  };

  return (
    <div className="login-container">
      <img src={knightLogo} alt="KnightsRide Logo" className="login-logo" />
      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="user@ucf.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="sign-in-btn">Sign In</button>
        </form>
        <div className="signup-link">
          <p>Don't have an account?</p>
          <button onClick={() => navigate('/signup')}>Sign up</button>
        </div>
      </div>
    </div>
  );
}

export default Login;