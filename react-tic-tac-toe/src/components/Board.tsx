import Square from './Square';

interface Props {
  squares: Array<'X'|'O'|null>;
  onSquareClick: (i: number) => void;
  winningLine?: number[] | null;
}

export default function Board({ squares, onSquareClick, winningLine }: Props) {
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}
      role="grid" 
      aria-label="tic-tac-toe-board"
    >
      {squares.map((val, idx) => (
        <Square
          key={idx}
          index={idx}
          value={val}
          isWinner={!!(winningLine && winningLine.includes(idx))}
          onClick={() => onSquareClick(idx)}
        />
      ))}
    </div>
  );
}