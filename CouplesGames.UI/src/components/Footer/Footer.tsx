import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className={styles.footer}>
      {user ? (
        <span>You are logged in as {user.email}</span>
      ) : (
        <span>You are not logged in. Please log in to continue.</span>
      )}
    </footer>
  );
};

export default Footer;
