import React from 'react';
import styles from './ResultsPopup.module.css';

interface ResultsPopupProps {
  question: string;
  answers: Record<string, string>;
  players: any[];
  currentUserUid: string; // Add current user UID
  onDismiss: () => void;
}

const ResultsPopup: React.FC<ResultsPopupProps> = ({ 
  question, 
  answers, 
  players,
  currentUserUid,
  onDismiss
}) => {
  // Extract options from question text
  const getOptions = () => {
    const match = question.match(/Would you rather (.+) or (.+)\?/i);
    return match && match.length === 3 ? [match[1], match[2]] : ['Option A', 'Option B'];
  };

  const [optionA, optionB] = getOptions();

  // Build choices for all players
  const allChoices = Object.entries(answers)
    .map(([uid, answer]) => {
      const player = players.find(p => p.uid === uid);
      const displayName = player ? player.displayName : `Player ${uid.slice(0, 6)}`;
      const isCurrentUser = uid === currentUserUid;
      
      let choiceText;
      if (answer === 'skip') {
        choiceText = 'Skipped';
      } else if (answer === 'A') {
        choiceText = optionA;
      } else if (answer === 'B') {
        choiceText = optionB;
      } else {
        choiceText = answer;
      }
      
      return {
        uid,
        displayName,
        choice: choiceText,
        isCurrentUser
      };
    });

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Round Results</h2>
        <div className={styles.question}>{question}</div>

        <div className={styles.resultsList}>
          {allChoices.map(({ uid, choice, isCurrentUser }) => (
            <div key={uid} className={styles.resultItem}>
              {isCurrentUser ? (
                <div>
                  <span className={styles.youChose}>You chose: </span>
                  {choice === 'Skipped' ? (
                    <span className={styles.skipped}>Skipped</span>
                  ) : (
                    <span className={styles.choice}>{choice}</span>
                  )}
                </div>
              ) : (
                <div>
                  <span className={styles.theyChose}>They chose: </span>
                  {choice === 'Skipped' ? (
                    <span className={styles.skipped}>Skipped</span>
                  ) : (
                    <span className={styles.choice}>{choice}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.dismissButton}
            onClick={onDismiss}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPopup;