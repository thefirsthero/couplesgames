import React from 'react';
import styles from './LoadingOverlay.module.css';
import { useLoading } from '../../contexts/LoadingContext';

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
};

export default LoadingOverlay;