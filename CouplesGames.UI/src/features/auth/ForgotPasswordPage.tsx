import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './../../lib/firebase';
import { Link } from 'react-router-dom';
import { logger } from '../../utils/logger';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent');
    } catch (err) {
      setMessage('Failed to send reset email');
      if (err instanceof Error) {
        logger.error(err);
      } else {
        logger.error(String(err));
      }
    }
  };  

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleReset}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <p>{message}</p>}
      <p><Link to="/auth">Back to Login</Link></p>
    </div>
  );
};

export default ForgotPasswordPage;
