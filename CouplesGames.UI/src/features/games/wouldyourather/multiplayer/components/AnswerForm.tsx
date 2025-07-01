import React, { useState } from 'react';
import styles from './AnswerForm.module.css';

interface AnswerFormProps {
  question: string;
  onSubmit: (answer: string) => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ question, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedOption) return;
    onSubmit(selectedOption);
  };

  // Extract options from question text
  const getOptions = () => {
    const match = question.match(/Would you rather (.+) or (.+)\?/i);
    if (match && match.length === 3) {
      return [match[1], match[2]];
    }
    return ['Option A', 'Option B'];
  };

  const [optionA, optionB] = getOptions();

  return (
    <div className={styles.container}>
      <h2>Would You Rather...</h2>
      <div className={styles.question}>{question}</div>
      
      <div className={styles.options}>
        <button
          className={`${styles.optionButton} ${selectedOption === 'A' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('A')}
        >
          {optionA}
        </button>
        
        <div className={styles.orDivider}>OR</div>
        
        <button
          className={`${styles.optionButton} ${selectedOption === 'B' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('B')}
        >
          {optionB}
        </button>
      </div>
      
      <button 
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={!selectedOption}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default AnswerForm;