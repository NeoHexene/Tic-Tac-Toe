import Square from "./Square";

interface Props {
    squares: Array<'X' | 'O' | null>;
    onSquareClick: (index: number) => void;
    winningLine?: number[] | null;
}


export default function Board({
    squares, onSquareClick, winningLine
}: Props) {
    return (
    <div className="grid grid-cols-3 gap-2 w-[300px]">
      {squares.map((value, i) => {
        const highlight = winningLine?.includes(i);

        return (
          <button
            key={i}
            onClick={() => onSquareClick(i)}
            className={`
              w-24 h-24 text-4xl font-bold rounded-xl flex items-center justify-center
              transition-all duration-200

              ${highlight ? "bg-green-600 text-black" : "bg-slate-800 text-white"}
              hover:bg-slate-700
            `}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}