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
import { useLoading } from '../../contexts/LoadingContext';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();

  const navigate = useNavigate();

  const passwordsMatch = () => {
    return isRegistering && password && retypePassword && password === retypePassword;
  };

  const handleAuth = async () => {
    if (isRegistering && password !== retypePassword) {
      toast.error("Passwords don't match");
      return;
    }

    startLoading();
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
    } finally {
      stopLoading();
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRetypeVisibility = () => setShowRetypePassword(!showRetypePassword);

  return (
    <div className={styles.container}>
      <ToastContainer position="top-center" />

      <div className={styles.card}>
        <h1 className={styles.title}>
          {isResetting ? 'Reset Password' : isRegistering ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className={styles.subtitle}>
          {isResetting 
            ? 'Enter your email to reset password' 
            : isRegistering 
              ? 'Create your account' 
              : 'Sign in to continue'}
        </p>

        <div className={styles.inputGroup}>
          <FiMail className={styles.inputIcon} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        {!isResetting && (
          <>
            <div className={styles.inputGroup}>
              <FiLock className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
              <button 
                onClick={togglePasswordVisibility} 
                className={styles.visibilityToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {isRegistering && (
              <div className={styles.inputGroup}>
                <FiLock className={styles.inputIcon} />
                <input
                  type={showRetypePassword ? 'text' : 'password'}
                  placeholder="Retype Password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className={styles.input}
                />
                <button 
                  onClick={toggleRetypeVisibility} 
                  className={styles.visibilityToggle}
                  aria-label={showRetypePassword ? "Hide password" : "Show password"}
                >
                  {showRetypePassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            )}

            {isRegistering && password && retypePassword && (
              <div className={`${styles.passwordMatch} ${passwordsMatch() ? styles.match : styles.mismatch}`}>
                {passwordsMatch() ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </>
        )}

        <button
          onClick={handleAuth}
          disabled={isLoading || (isRegistering && !passwordsMatch())}
          className={styles.primaryButton}
        >
          {isLoading
            ? 'Processing...'
            : isResetting
            ? 'Send Reset Email'
            : isRegistering
            ? 'Create Account'
            : 'Sign In'}
        </button>

        <div className={styles.secondaryActions}>
          {!isResetting && (
            <button
              onClick={() => {
                setIsRegistering((prev) => !prev);
                setRetypePassword('');
              }}
              className={styles.textButton}
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          )}
          <button
            onClick={() => {
              setIsResetting((prev) => !prev);
              setIsRegistering(false);
              setRetypePassword('');
            }}
            className={styles.textButton}
          >
            {isResetting ? 'Back to Sign In' : 'Forgot Password?'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;