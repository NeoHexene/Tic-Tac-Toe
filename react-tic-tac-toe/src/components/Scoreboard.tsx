export default function Scoreboard({scores}: {scores: {X: number, O:number, draws: number}}) {
    return (

        <div className="p-3 rounded-lg bg-slate-900/20">
            <div className="text-xs text-slate-400">Scoreboard</div>
            <div className="flex gap-4 mt-2">
                <div>X: <strong>{ scores.X }</strong></div>
                <div>O: <strong>{ scores.O }</strong></div>
                <div>Draws: <strong>{ scores.draws }</strong></div>
            </div>
        </div>

    );
}