import React, { useState } from 'react';
import styles from './AnswerForm.module.css';

interface AnswerFormProps {
  question: string;
  onSubmit: (answer: string) => void;
  colors: string[];
}

const AnswerForm: React.FC<AnswerFormProps> = ({ question, onSubmit, colors }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedOption) return;
    onSubmit(selectedOption);
  };

  const handleSkip = () => {
    onSubmit('skip');
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
      
      <div className={styles.options}>
        <button
          className={`${styles.optionButton} ${selectedOption === 'A' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('A')}
          style={{ backgroundColor: colors[0] }}
        >
          {optionA}
        </button>
        
        <div className={styles.orDivider}>OR</div>
        
        <button
          className={`${styles.optionButton} ${selectedOption === 'B' ? styles.selected : ''}`}
          onClick={() => setSelectedOption('B')}
          style={{ backgroundColor: colors[1] }}
        >
          {optionB}
        </button>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.skipButton}
          onClick={handleSkip}
        >
          Skip Question
        </button>
        <button 
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!selectedOption}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default AnswerForm;