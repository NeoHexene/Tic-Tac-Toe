import { useReducer, useEffect, useCallback } from "react";
import gameReducer, { initialState } from "../reducers/gameReducer";
import type { GameState } from "../reducers/gameReducer";
import { loadState, saveState } from "../utils/storage";

export default function useGame() {
    const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
        try {
            const loaded = loadState<GameState>();
            return loaded ?? init;
        } catch (e) {
            return init;
        }
    });

    useEffect(() => {
        saveState(state);
    }, [state]);

    const play = useCallback((squares: GameState['history'][0], isDraw = false) => {
        dispatch({type: 'PLAY', squares, isDraw});
    }, []);
}