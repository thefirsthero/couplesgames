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

  // Build a map of player -> chosen option text
  const playerChoices = players.map(player => {
    const answer = answers[player.uid];
    let choiceText = '';

    if (answer) {
      // If backend stores 'A'/'B', map to option text
      if (answer === 'A') choiceText = optionA;
      else if (answer === 'B') choiceText = optionB;
      // If backend stores actual text, use it directly
      else choiceText = answer;
    } else {
      choiceText = 'No answer';
    }

    return {
      name: player.displayName,
      choice: choiceText,
    };
  });

  return (
    <div className={styles.container}>
      <h2>Results</h2>
      <div className={styles.question}>{question}</div>

      <div className={styles.resultsList}>
        {playerChoices.map((p) => (
          <div key={p.name} className={styles.resultItem}>
            <span className={styles.playerName}>{p.name}</span>: <span className={styles.choice}>{p.choice}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsView;
