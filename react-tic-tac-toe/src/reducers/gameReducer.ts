import { calculateWinner } from "../utils/gameUtils";

export type player = 'X' | 'O';
export type boardState = Array<player | null>;

export interface GameState {
    history: boardState[];
    step: number;
    xIsNext: boolean;
    scores: {X: number; O: number; draws: number};
    settings: {ai: boolean; aiPlayer: player; difficulty: string | 'easy' | 'medium' | 'hard'};
}

export type action =
    | {type: 'PLAY'; squares: boardState; isDraw: boolean}
    | {type: 'JUMP'; step: number}
    | {type: 'RESET'}
    | {type: 'SET_SETTINGS'; settings: Partial<GameState['settings']>}
    | {type: 'SET_STATE'; state: Partial<GameState>};

export const initialState: GameState = {
    history: [Array(9).fill(null)],
    step: 0,
    xIsNext: true,
    scores: {X: 0, O: 0, draws: 0},
    settings: {ai: true, aiPlayer: 'O', difficulty: 'medium'}
};

export default function gameReducer(state: GameState, action: action): GameState {
    switch(action.type) {
        case 'PLAY': {
            const nextHistory = state.history.slice(0, state.step + 1);
            nextHistory.push(action.squares);
            const winnerResponse = calculateWinner(action.squares);
            const scores = {...state.scores};
            if (winnerResponse) {
                scores[winnerResponse.winner] += 1;
            } else if (action.isDraw) {
                scores.draws += 1;
            }
            return {
                ...state,
                history: nextHistory,
                step: nextHistory.length - 1,
                xIsNext: !state.xIsNext,
                scores
            };
        }

        case 'JUMP': {
            return {
                ...state,
                step: action.step,
                xIsNext: (action.step % 2) === 0
            };
        }

        case 'RESET': {
            return {
                ...state,
                history: [Array(9).fill(null)],
                step: 0,
                xIsNext: true
            };
        }

        case 'SET_SETTINGS': {
            return {
                ...state,
                settings: {...state.settings, ...action.settings}
            };
        }

        case 'SET_STATE': {
            return {
                ...state,
                ...action.state
            };
        }

        default:
            return state;
    }
}