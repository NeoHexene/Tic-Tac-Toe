import React, { useMemo, useEffect } from 'react';
import useGame from './hooks/useGame';
import Board from './components/Board';
import Controls from './components/Controls';
import MoveList from './components/MoveList';
import { calculateWinner, isBoardFull } from './utils/gameUtils';
import { findBestMove } from './ai/minimax';

export default function App() {
  const { state, play, jump, reset, setSettings } = useGame();
  const { history, step, xIsNext, settings, scores } = state;
  const current = history[step];
  const winnerRes = calculateWinner(current);
  const isDraw = !winnerRes && isBoardFull(current);
  const status = winnerRes ? `Winner: ${winnerRes.winner}` : isDraw ? 'Draw!' : `Next: ${xIsNext ? 'X' : 'O'}`;

  const lastMoveIndex = useMemo(() => {
    if (step === 0) return null;
    const prev = history[step - 1];
    for (let i = 0; i < 9; i++) if (prev[i] !== current[i]) return i;
    return null;
  }, [history, step, current]);

  function handleSquareClick(i: number) {
    if (current[i] || winnerRes) return;
    const next = current.slice();
    next[i] = xIsNext ? 'X' : 'O';
    const drawNow = !calculateWinner(next) && isBoardFull(next);
    play(next, drawNow);
  }

  function undo() { if (step > 0) jump(step - 1); }
  function redo() { if (step < history.length - 1) jump(step + 1); }

  // AI effect
  useEffect(() => {
    if (!settings.ai) return;
    const aiPlays = settings.aiPlayer;
    const currentPlayer = xIsNext ? 'X' : 'O';
    if (currentPlayer !== aiPlays) return;
    if (winnerRes || isDraw) return;

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
    }, 300 + Math.random() * 200);

    return () => clearTimeout(t);
  }, [current, xIsNext, settings, winnerRes, isDraw, play]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '32px',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          🎮 Tic-Tac-Toe AI
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '32px'
        }}>
          {/* Left: Game Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              padding: '16px 32px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              minWidth: '300px'
            }}>
              {status}
            </div>

            <Board 
              squares={current} 
              onSquareClick={handleSquareClick} 
              winningLine={winnerRes?.line ?? null} 
            />

            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button 
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: step === 0 ? 'not-allowed' : 'pointer',
                  opacity: step === 0 ? 0.5 : 1
                }}
                onClick={undo} 
                disabled={step === 0}
                onMouseEnter={(e) => {
                  if (step > 0) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ↶ Undo
              </button>
              <button 
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: step === history.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: step === history.length - 1 ? 0.5 : 1
                }}
                onClick={redo} 
                disabled={step === history.length - 1}
                onMouseEnter={(e) => {
                  if (step < history.length - 1) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Redo ↷
              </button>
              <button 
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                }}
                onClick={reset}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)';
                }}
              >
                🔄 New Game
              </button>
            </div>

            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center'
            }}>
              💡 Tip: Click move history to time-travel
            </p>
          </div>

          {/* Right: Side Panel */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Settings */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⚙️ Settings
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    🤖 Play vs AI
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      value={settings.ai ? 'on' : 'off'} 
                      onChange={e => setSettings({ ai: e.target.value === 'on' })}
                    >
                      <option value="on">On</option>
                      <option value="off">Off</option>
                    </select>

                    <select 
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        cursor: settings.ai ? 'pointer' : 'not-allowed',
                        fontSize: '14px',
                        fontWeight: '500',
                        opacity: settings.ai ? 1 : 0.5
                      }}
                      value={settings.aiPlayer} 
                      onChange={e => setSettings({ aiPlayer: e.target.value as 'X'|'O' })}
                      disabled={!settings.ai}
                    >
                      <option value="X">AI: X</option>
                      <option value="O">AI: O</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    🎯 Difficulty Level
                  </label>
                  <select 
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      cursor: settings.ai ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500',
                      opacity: settings.ai ? 1 : 0.5
                    }}
                    value={settings.difficulty} 
                    onChange={e => setSettings({ difficulty: e.target.value as any })}
                    disabled={!settings.ai}
                  >
                    <option value="easy">😊 Easy</option>
                    <option value="medium">😐 Medium</option>
                    <option value="hard">😈 Hard (Unbeatable)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                📊 Scoreboard
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                <div style={{
                  background: 'rgba(96, 165, 250, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '2px solid rgba(96, 165, 250, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#60a5fa'
                  }}>{scores.X}</div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '4px',
                    fontWeight: '600'
                  }}>X Wins</div>
                </div>
                <div style={{
                  background: 'rgba(156, 163, 175, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '2px solid rgba(156, 163, 175, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#9ca3af'
                  }}>{scores.draws}</div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '4px',
                    fontWeight: '600'
                  }}>Draws</div>
                </div>
                <div style={{
                  background: 'rgba(244, 114, 182, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '2px solid rgba(244, 114, 182, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#f472b6'
                  }}>{scores.O}</div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '4px',
                    fontWeight: '600'
                  }}>O Wins</div>
                </div>
              </div>
            </div>

            {/* Move History */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📜 Move History
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                maxHeight: '320px',
                overflowY: 'auto',
                paddingRight: '8px'
              }}>
                {history.map((_, move) => (
                  <button
                    key={move}
                    onClick={() => jump(move)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      background: move === step 
                        ? 'rgba(168, 85, 247, 0.3)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      color: move === step ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      border: move === step 
                        ? '2px solid rgba(168, 85, 247, 0.5)' 
                        : '2px solid transparent',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (move !== step) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (move !== step) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      }
                    }}
                  >
                    {move === 0 ? '🏁 Go to game start' : `${move}. Move #${move}`}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}