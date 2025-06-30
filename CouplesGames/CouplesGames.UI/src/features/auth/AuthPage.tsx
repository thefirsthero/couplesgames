// src/features/auth/AuthPage.tsx

import React, { useState } from 'react';
import { auth } from './../../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isResetting) {
        await sendPasswordResetEmail(auth, email);
        toast.success('Password reset email sent.');
      } else if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Registration successful.');
        navigate('/');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful.');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <ToastContainer />

      <h1>{isResetting ? 'Reset Password' : isRegistering ? 'Register' : 'Login'}</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.fullWidth}
      />

      {!isResetting && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.fullWidth}
        />
      )}

      <button
        onClick={handleAuth}
        disabled={loading}
        className={styles.fullWidthButton}
      >
        {loading
          ? 'Processing...'
          : isResetting
          ? 'Send Reset Email'
          : isRegistering
          ? 'Register'
          : 'Login'}
      </button>

      <div className={styles.switchButtons}>
        {!isResetting && (
          <button
            onClick={() => setIsRegistering((prev) => !prev)}
            className={styles.button}
          >
            {isRegistering ? 'Switch to Login' : 'Switch to Register'}
          </button>
        )}
        <button
          onClick={() => setIsResetting((prev) => !prev)}
          className={styles.button}
        >
          {isResetting ? 'Back to Login' : 'Forgot Password?'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
