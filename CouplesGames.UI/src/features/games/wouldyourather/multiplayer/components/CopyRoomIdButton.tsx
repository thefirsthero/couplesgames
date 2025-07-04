import React, { useState } from 'react';
import styles from './CopyRoomIdButton.module.css';
import { ClipboardCopy, Check } from 'lucide-react';

interface CopyRoomIdButtonProps {
  roomId: string;
}

const CopyRoomIdButton: React.FC<CopyRoomIdButtonProps> = ({ roomId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.copyContainer}>
      <button
        onClick={handleCopy}
        className={styles.copyButton}
        aria-label="Copy room ID"
        title="Copy room ID to clipboard"
      >
        <span className={styles.buttonText}>
          {copied ? 'Copied!' : 'Copy Room ID'}
        </span>
        {copied ? (
          <Check size={16} className={styles.icon} />
        ) : (
          <ClipboardCopy size={16} className={styles.icon} />
        )}
      </button>
    </div>
  );
};

export default CopyRoomIdButton;
