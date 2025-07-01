import React, { useState } from 'react';
import styles from './QuestionForm.module.css';

interface QuestionFormProps {
  onSubmit: (optionA: string, optionB: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!optionA.trim() || !optionB.trim()) {
      setError('Both options are required');
      return;
    }
    
    onSubmit(optionA.trim(), optionB.trim());
    setOptionA('');
    setOptionB('');
    setError('');
  };

  return (
    <div className={styles.container}>
      <h2>Your Turn to Ask a Question</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Option A:</label>
          <input
            type="text"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            placeholder="Enter first option"
            className={styles.input}
          />
        </div>
        
        <div className={styles.orDivider}>OR</div>
        
        <div className={styles.inputGroup}>
          <label>Option B:</label>
          <input
            type="text"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            placeholder="Enter second option"
            className={styles.input}
          />
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <button type="submit" className={styles.submitButton}>
          Ask Question
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;