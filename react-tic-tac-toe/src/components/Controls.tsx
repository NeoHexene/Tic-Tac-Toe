interface Props{
    status: string;
    onReset:() => void;
    onUndo:() => void;
    onRedo:() => void;
    settings: { ai: boolean; aiPlayer: 'X' | 'O'; difficulty: string };
    onChangeSettings: (patch: Partial<Props['settings']>) => void;
    scores: { X: number; O: number; draws: number };
}


export default function Controls({
    status, onReset, onUndo, onRedo, settings, onChangeSettings, scores
}: Props) {
    return (

        <div className="controls">
            <div className="text-sm text-slate-300">Status</div>
            <div className="text-lg font-semibold">{status}</div>

            <div className="flex gap-2 mt-2">
                <button className="btn" onClick={onUndo}>Undo</button>
                <button className="btn" onClick={onRedo}>Redo</button>
                <button className="btn primary" onClick={onReset}>New Game</button>
            </div>

            <div className="mt-3 flex flex-col gap-2">
                <label className="text-xs text-slate-400">Play vs AI</label>
                <div className="flex gap-2">
                    <select className="btn" value={settings.ai ? 'on' : 'off'} onChange={
                        e => onChangeSettings({ai: e.target.value === 'on'})
                    }>
                        <option value="on">On</option>
                        <option value="off">Off</option>
                    </select>

                    <select className="btn" value={settings.aiPlayer} onChange={
                        e => onChangeSettings({aiPlayer: e.target.value as 'X' | 'O'})
                    }>
                        <option value="X">X</option>
                        <option value="O">O</option>
                    </select>
                    
                    <select className="btn" value={settings.difficulty} onChange={
                        e => onChangeSettings({difficulty: e.target.value as any})
                    }>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>
            <div className="mt-3 text-sm text-slate-400">
                <div>Scores</div>
                <div className="flex gap-3 mt-1">
                    <div>X: {scores.X}</div>
                    <div>O: {scores.O}</div>
                    <div>Draws: {scores.draws}</div>
                </div>
            </div>
        </div>
        
    );
}