import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../lib/firebase';

const AuthPage: React.FC = () => {
  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, 'test@example.com', 'password123');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Firebase</button>
    </div>
  );
};

export default AuthPage;
