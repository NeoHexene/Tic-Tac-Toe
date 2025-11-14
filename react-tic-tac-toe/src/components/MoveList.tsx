export default function MoveList({history, currentStep, onJump}: {history:
    Array<Array<'X'|'O'|null>>; currentStep: number; onJump: (step: number) => void;
}) {
    return (

        <div className="moves mt-2">
            {history.map((_, idx) => (
                <div key={idx} className={`move ${idx === currentStep ? 'active' : ''}`} onClick={() => onJump(idx)}>
                    {idx === 0 ? 'Go to game start' : `Go to move #${idx}`}
                </div>
            ))}
        </div>

    );
}