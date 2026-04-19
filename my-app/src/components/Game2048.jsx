import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const SIZE = 4;

const createEmptyGrid = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

const cloneGrid = (grid) =>
  grid.map((row) =>
    row.map((tile) => (tile ? { ...tile } : null))
  );

const listEmptyCells = (grid) => {
  const cells = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (!grid[row][col]) cells.push({ row, col });
    }
  }
  return cells;
};

const randomCell = (grid) => {
  const cells = listEmptyCells(grid);
  if (!cells.length) return null;
  return cells[Math.floor(Math.random() * cells.length)];
};

const addRandomTile = (grid, createTile) => {
  const position = randomCell(grid);
  if (!position) return { grid, newTileId: null };

  const value = Math.random() < 0.9 ? 2 : 4;
  const tile = createTile(value, position);
  const nextGrid = cloneGrid(grid);
  nextGrid[position.row][position.col] = tile;
  return { grid: nextGrid, newTileId: tile.id };
};

const initializeGrid = (createTile) => {
  const start = createEmptyGrid();
  const first = addRandomTile(start, createTile);
  const second = addRandomTile(first.grid, createTile);

  return {
    grid: second.grid
  };
};

const vectors = {
  up: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 }
};

const buildTraversals = (vector) => {
  const rows = Array.from({ length: SIZE }, (_, index) => index);
  const cols = Array.from({ length: SIZE }, (_, index) => index);

  if (vector.row === 1) rows.reverse();
  if (vector.col === 1) cols.reverse();

  return { rows, cols };
};

const withinBounds = (position) =>
  position.row >= 0 &&
  position.row < SIZE &&
  position.col >= 0 &&
  position.col < SIZE;

const cellContent = (grid, position) =>
  withinBounds(position) ? grid[position.row][position.col] : null;

const findFarthestPosition = (grid, start, vector) => {
  let previous = start;
  let next = { row: start.row + vector.row, col: start.col + vector.col };

  while (withinBounds(next) && !cellContent(grid, next)) {
    previous = next;
    next = { row: previous.row + vector.row, col: previous.col + vector.col };
  }

  return { farthest: previous, next };
};

const movesAvailable = (grid) => {
  if (listEmptyCells(grid).length) return true;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const tile = grid[row][col];
      if (!tile) continue;

      const right = col + 1 < SIZE ? grid[row][col + 1] : null;
      const down = row + 1 < SIZE ? grid[row + 1][col] : null;

      if (tile.value === right?.value || tile.value === down?.value) {
        return true;
      }
    }
  }

  return false;
};

const prepareTiles = (grid) => {
  grid.forEach((row) => {
    row.forEach((tile) => {
      if (!tile) return;
      tile.previousPosition = { row: tile.row, col: tile.col };
      tile.mergedFrom = null;
    });
  });
};

const moveTile = (grid, tile, position) => {
  grid[tile.row][tile.col] = null;
  grid[position.row][position.col] = tile;
  tile.row = position.row;
  tile.col = position.col;
};

const moveGrid = (grid, direction, createTile) => {
  const vector = vectors[direction];
  const traversals = buildTraversals(vector);
  let moved = false;
  let scoreGain = 0;

  traversals.rows.forEach((row) => {
    traversals.cols.forEach((col) => {
      const tile = grid[row][col];
      if (!tile) return;

      const position = { row, col };
      const { farthest, next } = findFarthestPosition(grid, position, vector);
      const nextTile = cellContent(grid, next);

      if (nextTile && nextTile.value === tile.value && !nextTile.mergedFrom) {
        const mergedTile = createTile(tile.value * 2, next);
        mergedTile.mergedFrom = [tile, nextTile];

        grid[next.row][next.col] = mergedTile;
        grid[row][col] = null;
        tile.row = next.row;
        tile.col = next.col;

        scoreGain += mergedTile.value;
        moved = true;
      } else {
        if (position.row !== farthest.row || position.col !== farthest.col) {
          moveTile(grid, tile, farthest);
          moved = true;
        }
      }
    });
  });

  return { grid, moved, scoreGain };
};

function Game2048({ onScoreChange, onGameOver, stopSignal }) {
  const tileIdRef = useRef(0);
  const createTile = useCallback((value, position) => {
    tileIdRef.current += 1;
    return {
      id: tileIdRef.current,
      value,
      row: position.row,
      col: position.col,
      previousPosition: null,
      mergedFrom: null
    };
  }, []);

  const [grid, setGrid] = useState(() => initializeGrid(createTile).grid);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing');
  const [animateFromPrevious, setAnimateFromPrevious] = useState(false);
  const touchStartRef = useRef(null);

  useEffect(() => {
    if (!animateFromPrevious) return undefined;
    const frame = window.requestAnimationFrame(() => setAnimateFromPrevious(false));
    return () => window.cancelAnimationFrame(frame);
  }, [animateFromPrevious]);

  useEffect(() => {
    if (onScoreChange) onScoreChange(score);
  }, [onScoreChange, score]);

  useEffect(() => {
    if (stopSignal > 0 && status === 'playing') {
      setStatus('stopped');
      if (onGameOver) onGameOver(score);
    }
  }, [onGameOver, score, status, stopSignal]);

  const handleMove = useCallback(
    (direction) => {
      if (status !== 'playing') return;

      setGrid((prevGrid) => {
        const workingGrid = cloneGrid(prevGrid);
        prepareTiles(workingGrid);
        const { grid: movedGrid, moved, scoreGain } = moveGrid(
          workingGrid,
          direction,
          createTile
        );

        if (!moved) return prevGrid;

        let updatedScore = 0;
        setScore((prevScore) => {
          updatedScore = prevScore + scoreGain;
          return updatedScore;
        });

        const { grid: gridWithTile } = addRandomTile(movedGrid, createTile);

        if (!movesAvailable(gridWithTile)) {
          setStatus('over');
          if (onGameOver) onGameOver(updatedScore);
        }

        setAnimateFromPrevious(true);
        return gridWithTile;
      });
    },
    [createTile, onGameOver, status]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (status !== 'playing') return;

      const key = event.key.toLowerCase();
      const directionMap = {
        arrowleft: 'left',
        arrowright: 'right',
        arrowup: 'up',
        arrowdown: 'down',
        a: 'left',
        d: 'right',
        w: 'up',
        s: 'down'
      };

      const direction = directionMap[key];
      if (!direction) return;

      event.preventDefault();
      handleMove(direction);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, status]);

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    if (!touchStartRef.current || status !== 'playing') return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) < 24) return;

    if (absX > absY) {
      handleMove(deltaX > 0 ? 'right' : 'left');
    } else {
      handleMove(deltaY > 0 ? 'down' : 'up');
    }
  };

  const resetGame = () => {
    tileIdRef.current = 0;
    const { grid: freshGrid } = initializeGrid(createTile);
    setGrid(freshGrid);
    setScore(0);
    setStatus('playing');
  };

  const tiles = useMemo(() => {
    const list = [];
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const tile = grid[row][col];
        if (!tile) continue;
        list.push(tile);
        if (animateFromPrevious && tile.mergedFrom) {
          tile.mergedFrom.forEach((mergedTile) => {
            list.push({ ...mergedTile, isGhost: true });
          });
        }
      }
    }
    return list;
  }, [animateFromPrevious, grid]);

  return (
    <div className="game-2048">
      <div className="game-2048-header">
        <div>
          <p className="game-2048-title">2048</p>
          <p className="game-2048-subtitle">Swipe or use arrow keys.</p>
        </div>
        <div className="game-2048-score">
          <span>Score</span>
          <strong>{score}</strong>
        </div>
      </div>

      <div
        className="game-2048-board"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="game-2048-grid" aria-hidden="true">
          {Array.from({ length: SIZE * SIZE }, (_, index) => (
            <div key={`cell-${index}`} className="game-2048-cell" />
          ))}
        </div>
        {tiles.map((tile) => {
          const position =
            animateFromPrevious && tile.previousPosition
              ? tile.previousPosition
              : { row: tile.row, col: tile.col };
          const isMerged = !!tile.mergedFrom && !tile.isGhost;
          const isNew = !tile.previousPosition && !tile.mergedFrom && !tile.isGhost;

          return (
            <div
              key={tile.isGhost ? `ghost-${tile.id}` : tile.id}
              className={`game-2048-tile tile-${tile.value}`}
              style={{ '--row': `${position.row}`, '--col': `${position.col}` }}
            >
              <div
                className={`game-2048-tile-inner${
                  isNew ? ' tile-new' : ''
                }${isMerged ? ' tile-merged' : ''}`}
              >
                {tile.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="game-2048-footer">
        {status === 'over' && <span>Game over.</span>}
        {status === 'stopped' && <span>Server ready - wrapping up.</span>}
        <button type="button" onClick={resetGame} className="game-2048-reset">
          New game
        </button>
      </div>
    </div>
  );
}

export default Game2048;
