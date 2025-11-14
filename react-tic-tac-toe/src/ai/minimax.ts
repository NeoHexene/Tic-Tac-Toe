import { calculateWinner, isBoardFull } from "../utils/gameUtils";

export type Player = 'X' | 'O';
type Board = Array<Player | null>;

function scoreResult(result: Player | 'draw' | null, depth: number, aiPlayer: Player) {
    if (result === aiPlayer) {
        return 10 - depth;
    } else if (result && result != aiPlayer) {
        return depth - 10;
    }
    return 0;
}

export function findBestMove(board: Board, aiPlayer: Player): number {
    const human: Player = aiPlayer === 'O' ? 'X' : 'O';

    function minimax (b: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
        const result = calculateWinner(b);
        if (result) {
            return scoreResult(result.winner as Player, depth, aiPlayer);
        }
        if (isBoardFull(b)) {
            return 0;
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!b[i]) {
                    b[i] = aiPlayer;
                    const evalScore = minimax(b, depth + 1, false, alpha, beta);
                    b[i] = null;
                    maxEval = Math.max(maxEval, evalScore);
                    alpha = Math.max(alpha, evalScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!b[i]) {
                    b[i] = human;
                    const evalScore = minimax(b, depth + 1, true, alpha, beta);
                    b[i] = null;
                    minEval = Math.min(minEval, evalScore);
                    beta = Math.min(beta, evalScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            return minEval;
        }
    }

    let bestEval = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = aiPlayer;
            const moveEval = minimax(board, 0, false, -Infinity, Infinity);
            board[i] = null;
            if (moveEval > bestEval) {
                bestEval = moveEval;
                bestMove = i;
            }
        }
    }
    return bestMove;
}