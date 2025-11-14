import React, { useMemo, useEffect } from 'react';
import useGame from './hooks/useGame';
import { calculateWinner, isBoardFull } from './utils/gameUtils';
import { findBestMove } from './ai/minimax';
import Board from './components/Board';
import Controls from './components/Controls';
import MoveList from './components/MoveList';

export default function App() {
  const { state, play, jump, reset, setSettings } = useGame();
  const { history, step, xIsNext, settings, scores } = state;
  const current = history[step];
  const winnerRes = calculateWinner(current);
  const isDraw = !winnerRes && isBoardFull(current);
  const status = winnerRes ? `Winner: ${winnerRes.winner}` : isDraw ? 'Draw' : `Next: ${xIsNext ? 'X' : 'O'}`;

  const lastMoveIndex = useMemo(() => {
    if (step === 0) {
      return null;
    }
    const prev = history[step - 1];
    for (let i = 0; i < 9; i++) {
      if (prev[i] != current[i]) {
        return i;
      }
    }
    return null;
  }, [history, step, current]);

  function handleSquareClick(i: number) {
    if (current[i] || winnerRes) {
      return;
    }
    const next = current.slice();
    next[i] = xIsNext ? 'X' : 'O';
    const drawNow = !calculateWinner(next) && isBoardFull(next);
    play(next, drawNow);
  }

  function undo() {
    if (step > 0) {
      jump(step - 1);
    }
  }

  function redo() {
    if (step < history.length - 1) {
      jump(step + 1);
    }
  }

  useEffect(() => {
    if (!settings.ai) {
      return;
    }
    const aiPlays = settings.aiPlayer;
    const currentPlayer = xIsNext ? 'X' : 'O';
    if (currentPlayer !== aiPlays) {
      return;
    }
    if (winnerRes || isDraw) {
      return;
    }
    const t = setTimeout(() => {
      const boardCopy = current.slice();
      let move = -1;

      if (settings.difficulty === 'easy') {
        const avail = boardCopy.map((v, idx) => v ? null : idx).filter((v) => v !== null) as number[];
        move = avail[Math.floor(Math.random() * avail.length)];
      } else if (settings.difficulty === 'medium') {
        if (Math.random() < 0.5) {
          move = findBestMove(boardCopy as any, settings.aiPlayer);
        } else {
          const avail = boardCopy.map((v, idx) => v ? null : idx).filter((v) => v !== null) as number[];
          move = avail[Math.floor(Math.random() * avail.length)];
        }
      } else {
        move = findBestMove(boardCopy as any, settings.aiPlayer);
      }

      if (move != null && move >= 0) {
        const next = current.slice();
        next[move] = currentPlayer;
        const drawNow = !calculateWinner(next) && isBoardFull(next);
        play(next, drawNow);
      }
    }, 200 + Math.random() * 250);
    return () => clearTimeout(t);
  }, [current, xIsNext, settings, winnerRes, isDraw, play]);

  return (
    <div className="w-screen h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
      {/* Main container */}
      <div className="flex gap-6 max-w-6xl w-full">

        {/* LEFT: GAME AREA */}
        <div className="flex flex-col items-center flex-1">

          {/* Title + Status */}
          <div className="w-full text-center mb-4">
            <h1 className="text-3xl font-bold mb-1">Tic-Tac-Toe</h1>
            <p className="text-slate-300 text-lg">{status}</p>
          </div>

          {/* BOARD */}
          <Board
            squares={current}
            onSquareClick={handleSquareClick}
            winningLine={winnerRes?.line ?? null}
          />

          {/* CONTROLS */}
          <div className="flex gap-3 mt-5">
            <button className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              onClick={undo}>Undo</button>

            <button className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              onClick={redo}>Redo</button>

            <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
              onClick={reset}>New Game</button>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Tip: Click move history to time-travel.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <aside className="w-80 bg-[#1a1a1a] p-5 rounded-xl shadow-lg border border-slate-800">

          <Controls
            status={status}
            onReset={reset}
            onUndo={undo}
            onRedo={redo}
            settings={settings}
            onChangeSettings={(patch) => setSettings(patch)}
            scores={scores}
          />

          <div className="mt-6">
            <h2 className="text-md font-semibold mb-2">Move History</h2>

            <MoveList
              history={history}
              currentStep={step}
              onJump={jump}
            />
          </div>
        </aside>
      </div>
    </div>
  );

}
