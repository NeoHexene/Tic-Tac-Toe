interface Props {
    value: 'X' | 'O' | null;
    onClick: () => void;
    isWinner?: boolean;
    index: number;
}


export default function Square({
    value, onClick, isWinner = false, index
}: Props) {
    return (
        <button aria-label={`square-${index}`} className={`square ${isWinner ? 'winner' : ''}`}
        onClick={onClick} tabIndex={0}>{ value }</button>
    );
}