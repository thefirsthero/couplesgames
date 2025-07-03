import React from 'react';
import styles from './ResultsView.module.css';

interface Player {
  uid: string;
  displayName: string;
}

interface ResultsViewProps {
  question: string;
  answers: Record<string, string>;
  players: Player[];
}

const ResultsView: React.FC<ResultsViewProps> = ({ question, answers, players }) => {
  // Extract options from question text
  const getOptions = () => {
    const match = question.match(/Would you rather (.+) or (.+)\?/i);
    return match && match.length === 3 ? [match[1], match[2]] : ['Option A', 'Option B'];
  };

  const [optionA, optionB] = getOptions();

  // Build player choices
  const playerChoices = players.map(player => {
    const answer = answers[player.uid];
    
    if (!answer) return {
      name: player.displayName,
      choice: 'No answer'
    };

    // Handle answer formats
    if (answer === 'A') return {
      name: player.displayName,
      choice: optionA
    };

    if (answer === 'B') return {
      name: player.displayName,
      choice: optionB
    };

    // For custom questions
    return {
      name: player.displayName,
      choice: answer
    };
  });

  return (
    <div className={styles.container}>
      <h2>Results</h2>
      <div className={styles.question}>{question}</div>

      <div className={styles.resultsList}>
        {playerChoices.map((p) => (
          <div key={p.name} className={styles.resultItem}>
            <span className={styles.playerName}>{p.name}</span>: 
            <span className={styles.choice}>{p.choice}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsView;