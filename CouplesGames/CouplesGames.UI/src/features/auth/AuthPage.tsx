// src/features/auth/AuthPage.tsx

import React, { useState } from 'react';
import { auth } from './../../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (isResetting) {
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email sent.');
      } else if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('Registration successful.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Login successful.');
      }
    } catch (error: any) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>{isResetting ? 'Reset Password' : isRegistering ? 'Register' : 'Login'}</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      {!isResetting && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      )}

      <button onClick={handleAuth} disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Processing...' : isResetting ? 'Send Reset Email' : isRegistering ? 'Register' : 'Login'}
      </button>

      <div style={{ marginTop: '10px' }}>
        {!isResetting && (
          <button
            onClick={() => setIsRegistering((prev) => !prev)}
            style={{ marginRight: '10px' }}
          >
            {isRegistering ? 'Switch to Login' : 'Switch to Register'}
          </button>
        )}
        <button onClick={() => setIsResetting((prev) => !prev)}>
          {isResetting ? 'Back to Login' : 'Forgot Password?'}
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthPage;
