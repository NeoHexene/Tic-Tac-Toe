export const lines: number[][] = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

export function calculateWinner(squares: Array<'X' | 'O' | null>) {
    for(const [a,b,c] of lines) {
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: [a,b,c] as [number, number, number]
            };
        }
    }
    return null;
}

export function isBoardFull(squares: Array<'X' | 'O' | null>) {
    return squares.every(Boolean);
}

export function nextPlayerFromSquare(squares: Array<'X' | 'O' | null>) {
    return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}
