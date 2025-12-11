# 🎮 Tic-Tac-Toe Game

A modern, interactive Tic-Tac-Toe game built with React and TypeScript. Clean code and smart game logic.

## [Live Demo](https://www.youtube.com/watch?v=TsJbLFxsGIo)

---

## Overview

Classic Tic-Tac-Toe game with a modern twist. Built to demonstrate React fundamentals, TypeScript integration, and clean component architecture. Features game state management, win detection algorithms, and move history functionality.

**Tech Stack**: React • TypeScript • CSS3 • HTML5

---

## Key Features

- **Smart Game Logic** - Efficient win detection algorithm checking 8 winning patterns
- **Time Travel** - Navigate through game history with move replay
- **Type-Safe** - Full TypeScript implementation for robust code
- **State Management** - React hooks for efficient state handling

---

## Technical Highlights

### Win Detection Algorithm
```typescript
const calculateWinner = (squares: (string | null)[]): string | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};
```

### State Management
- Used `useState` hooks for board state, player turns, and game history
- Implemented immutable state updates for predictable behavior
- Created snapshot-based history for the time travel feature

### Component Architecture
- **Game Component** - Main orchestrator, handles game logic
- **Board Component** - Renders 3×3 grid
- **Square Component** - Individual clickable cells
- Clean props flow following React best practices

---

## Key Problem Solved

**Challenge**: Implementing efficient game state history for "time travel" feature without performance degradation.

**Solution**: Maintained immutable state snapshots in an array. Each move creates a new state object rather than mutating existing state, enabling instant jumps to any previous game state while preventing side effects.

---

## Quick Start

```bash
git clone https://github.com/NeoHexene/Tic-Tac-Toe.git
cd Tic-Tac-Toe/react-tic-tac-toe
npm install
npm run dev
```

---

## Future Enhancements

- Online multiplayer using WebSockets
- Advanced analytics (win rate tracking, move patterns)
- Custom board sizes (4×4, 5×5)

---

## What I Learned

- **React Patterns** - Component composition, hooks, and state lifting
- **TypeScript** - Interface design, type inference, and generic types
- **Algorithm Design** - Efficient win detection with O(1) space complexity
- **Clean Code** - Separation of concerns and reusable components
