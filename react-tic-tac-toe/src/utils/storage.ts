const key = "react_tic_tac_toe_v1";

export function saveState<T>(state: T) {
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch(err) {
        console.error(err);
    }
}

export function loadState<T>(): T | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch(err) {
        console.error(err);
        return null;
    }
}