import React from 'react';
import styles from './ResultsView.module.css';

interface ResultsViewProps {
  question: string;
  answers: Record<string, string>;
  currentUserUid: string;
}

const ResultsView: React.FC<ResultsViewProps> = ({ question, answers, currentUserUid }) => {
  // Extract options from question text
  const getOptions = () => {
    const match = question.match(/Would you rather (.+) or (.+)\?/i);
    return match && match.length === 3 ? [match[1], match[2]] : ['Option A', 'Option B'];
  };

  const [optionA, optionB] = getOptions();

  // Build choices excluding current user
  const otherChoices = Object.entries(answers)
    .filter(([uid]) => uid !== currentUserUid)
    .map(([uid, answer]) => {
      const choiceText = answer === 'A' ? optionA : answer === 'B' ? optionB : answer;
      return {
        uid,
        choice: choiceText
      };
    });

  return (
    <div className={styles.container}>
      <h2>Results</h2>
      <div className={styles.question}>{question}</div>

      {otherChoices.length > 0 ? (
        <div className={styles.resultsList}>
          {otherChoices.map(({ uid, choice }) => (
            <div key={uid} className={styles.resultItem}>
              They chose option: <span className={styles.choice}>{choice}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noOtherAnswers}>No other player answered yet.</div>
      )}
    </div>
  );
};

export default ResultsView;
