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

    const jump = useCallback((step: number) => {
        dispatch({type: 'JUMP', step});
    }, []);

    const reset = useCallback(() => {
        dispatch({type: 'RESET'});
    }, []);

    const setSettings = useCallback((settings: Partial<GameState['settings']>) => {
        dispatch({type: 'SET_SETTINGS', settings});
    }, []);

    return {
        state,
        play,
        jump,
        reset,
        setSettings
    };
}