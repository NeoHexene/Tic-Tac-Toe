import React from 'react';

interface Props {
  value: 'X' | 'O' | null;
  onClick: () => void;
  isWinner?: boolean;
  index: number;
}

export default function Square({ value, onClick, isWinner = false, index }: Props) {
  const baseStyle: React.CSSProperties = {
    aspectRatio: '1',
    width: '100%',
    minWidth: '120px',
    minHeight: '120px',
    fontSize: '4rem',
    fontWeight: 'bold',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    userSelect: 'none',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    cursor: value ? 'not-allowed' : 'pointer'
  };

  const backgroundColor = isWinner
    ? 'rgba(16, 185, 129, 0.3)'
    : value
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(255, 255, 255, 0.1)';

  const borderColor = isWinner
    ? 'rgba(16, 185, 129, 0.5)'
    : 'rgba(255, 255, 255, 0.2)';

  const color = value === 'X' 
    ? '#60a5fa' 
    : value === 'O' 
    ? '#f472b6' 
    : '#ffffff';

  return (
    <button
      aria-label={`square-${index}`}
      style={{
        ...baseStyle,
        backgroundColor,
        borderColor,
        color,
        boxShadow: isWinner ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none'
      }}
      onClick={onClick}
      disabled={!!value}
      tabIndex={0}
      onMouseEnter={(e) => {
        if (!value) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
        }
      }}
      onMouseLeave={(e) => {
        if (!value) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }
      }}
    >
      {value}
    </button>
  );
}