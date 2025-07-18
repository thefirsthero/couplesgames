import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { logger } from '../../utils/logger';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/rooms');
    } catch (err) {
      setError('Failed to register');
      if (err instanceof Error) {
        logger.error(err);
      } else {
        logger.error(String(err));
      }
    }
  };  

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <p>
        Already have an account? <Link to="/auth">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
