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
    if (match && match.length === 3) {
      return [match[1], match[2]];
    }
    return ['Option A', 'Option B'];
  };

  const [optionA, optionB] = getOptions();

  return (
    <div className={styles.container}>
      <h2>Results</h2>
      <div className={styles.question}>{question}</div>
      
      <div className={styles.resultsContainer}>
        <div className={styles.optionResult}>
          <h3>{optionA}</h3>
          <ul className={styles.playersList}>
            {players
              .filter(player => answers[player.uid] === 'A')
              .map(player => (
                <li key={player.uid} className={styles.player}>
                  {player.displayName}
                </li>
              ))}
          </ul>
        </div>
        
        <div className={styles.optionResult}>
          <h3>{optionB}</h3>
          <ul className={styles.playersList}>
            {players
              .filter(player => answers[player.uid] === 'B')
              .map(player => (
                <li key={player.uid} className={styles.player}>
                  {player.displayName}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;