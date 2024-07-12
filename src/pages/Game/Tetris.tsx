import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, Typography, Space, Modal } from 'antd';
import { ReloadOutlined, PauseOutlined, CaretRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_TICK_RATE_MS = 800;
const FAST_DROP_RATE_MS = 50;
const LEVEL_UP_SCORE = 1000;
const SPEED_INCREASE = 50;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#1890ff' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#13c2c2' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#fa8c16' },
  O: { shape: [[1, 1], [1, 1]], color: '#fadb14' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#52c41a' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#722ed1' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f5222d' },
};

type TetrominoType = keyof typeof TETROMINOS;

interface Tetromino {
  shape: number[][];
  color: string;
}

interface GameState {
  board: string[][];
  currentPiece: Tetromino;
  nextPiece: Tetromino;
  position: { x: number; y: number };
  gameOver: boolean;
  score: number;
  level: number;
  isPaused: boolean;
  showModal: boolean;
  isDropping: boolean;
}

const createEmptyBoard = (): string[][] =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(''));

const randomTetromino = (): Tetromino => {
  const keys = Object.keys(TETROMINOS) as TetrominoType[];
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOS[randKey];
};

const Tetris: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: randomTetromino(),
    nextPiece: randomTetromino(),
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    gameOver: false,
    score: 0,
    level: 1,
    isPaused: false,
    showModal: false,
    isDropping: false,
  });

  const [cellSize, setCellSize] = useState(130);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCellSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const cellWidth = Math.floor((containerWidth - 40) / (BOARD_WIDTH + 6)); // Extra space for next piece preview
      const cellHeight = Math.floor((containerHeight - 150) / BOARD_HEIGHT);
      setCellSize(Math.min(cellWidth, cellHeight, 30));
    }
  }, []);

  useEffect(() => {
    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [updateCellSize]);

  const isValidMove = (board: string[][], shape: number[][], x: number, y: number): boolean => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] !== 0) {
          const newX = x + j;
          const newY = y + i;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX] !== '')) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!isValidMove(gameState.board, gameState.currentPiece.shape, gameState.position.x + dx, gameState.position.y + dy)) {
      return false;
    }
    setGameState(prev => ({
      ...prev,
      position: { x: prev.position.x + dx, y: prev.position.y + dy },
    }));
    return true;
  }, [gameState]);

  const rotatePiece = useCallback(() => {
    const rotated = gameState.currentPiece.shape[0].map((_, index) =>
      gameState.currentPiece.shape.map(row => row[index]).reverse()
    );
    if (isValidMove(gameState.board, rotated, gameState.position.x, gameState.position.y)) {
      setGameState(prev => ({
        ...prev,
        currentPiece: { ...prev.currentPiece, shape: rotated },
      }));
    }
  }, [gameState]);

  const hardDrop = useCallback(() => {
    let newY = gameState.position.y;
    while (isValidMove(gameState.board, gameState.currentPiece.shape, gameState.position.x, newY + 1)) {
      newY++;
    }
    setGameState(prev => ({
      ...prev,
      position: { ...prev.position, y: newY },
    }));
  }, [gameState]);

  const mergePieceToBoard = useCallback(() => {
    const newBoard = gameState.board.map(row => [...row]);
    gameState.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[y + gameState.position.y][x + gameState.position.x] = gameState.currentPiece.color;
        }
      });
    });
    return newBoard;
  }, [gameState]);

  const checkRows = useCallback((board: string[][]): { newBoard: string[][], clearedRows: number } => {
    let clearedRows = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== '')) {
        clearedRows++;
        return false;
      }
      return true;
    });
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }
    return { newBoard, clearedRows };
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    if (!movePiece(0, 1)) {
      const newBoard = mergePieceToBoard();
      const { newBoard: clearedBoard, clearedRows } = checkRows(newBoard);
      const newScore = gameState.score + clearedRows * 100 * gameState.level;
      const newLevel = Math.floor(newScore / LEVEL_UP_SCORE) + 1;

      if (clearedBoard[0].some(cell => cell !== '')) {
        setGameState(prev => ({ ...prev, gameOver: true, showModal: true }));
      } else {
        setGameState(prev => ({
          ...prev,
          board: clearedBoard,
          currentPiece: prev.nextPiece,
          nextPiece: randomTetromino(),
          position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
          score: newScore,
          level: newLevel,
          isDropping: false,
        }));
      }
    }
  }, [gameState, movePiece, mergePieceToBoard, checkRows]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.gameOver || gameState.isPaused) return;
      switch (event.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          if (!gameState.isDropping) {
            setGameState(prev => ({ ...prev, isDropping: true }));
          }
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          hardDrop();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setGameState(prev => ({ ...prev, isDropping: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, movePiece, rotatePiece, hardDrop]);

  useEffect(() => {
    if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current);
    }

    const tickRate = gameState.isDropping ? FAST_DROP_RATE_MS : Math.max(INITIAL_TICK_RATE_MS - (gameState.level - 1) * SPEED_INCREASE, 100);

    dropIntervalRef.current = setInterval(gameLoop, tickRate);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [gameState.isDropping, gameState.level, gameLoop]);

  const restartGame = () => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: randomTetromino(),
      nextPiece: randomTetromino(),
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      gameOver: false,
      score: 0,
      level: 1,
      isPaused: false,
      showModal: false,
      isDropping: false,
    });
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const closeModal = () => {
    setGameState(prev => ({ ...prev, showModal: false }));
  };

  const renderCell = (color: string, key: string) => (
    <div
      key={key}
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        backgroundColor: color || 'white',
        border: '1px solid #d9d9d9',
      }}
    />
  );

  const renderNextPiece = () => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${cellSize}px)`, gap: '1px' }}>
      {Array(4).fill(null).map((_, i) => (
        Array(4).fill(null).map((_, j) => renderCell(
          gameState.nextPiece.shape[i]?.[j] ? gameState.nextPiece.color : 'transparent',
          `next-${i}-${j}`
        ))
      ))}
    </div>
  );

  return (
    <Card
      title={<Title level={3}>Tetris</Title>}
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={restartGame}>
            Restart
          </Button>
          <Button
            icon={gameState.isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
            onClick={togglePause}
          >
            {gameState.isPaused ? 'Resume' : 'Pause'}
          </Button>
        </Space>
      }
      style={{ width: '100%', height: '100%', maxWidth: '500px', margin: 'auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }} ref={containerRef}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${cellSize}px)`,
            gap: '1px',
            backgroundColor: '#f0f0f0',
            padding: '1px',
            border: '2px solid #d9d9d9',
          }}
        >
          {gameState.board.map((row, i) =>
            row.map((cell, j) => renderCell(
              cell ||
              (gameState.currentPiece.shape[i - gameState.position.y]?.[j - gameState.position.x]
                ? gameState.currentPiece.color
                : ''),
              `${i}-${j}`
            ))
          )}
        </div>
        <div style={{ marginLeft: '20px' }}>
          <Text strong>Next:</Text>
          {renderNextPiece()}
          <Text strong style={{ display: 'block', marginTop: '20px' }}>Score: {gameState.score}</Text>
          <Text strong style={{ display: 'block' }}>Level: {gameState.level}</Text>
        </div>
      </div>
      <Modal
        title="Game Over"
        visible={gameState.showModal}
        onOk={restartGame}
        onCancel={closeModal}
        okText="Restart"
        cancelText="Close"
      >
        <p>Your score: {gameState.score}</p>
        <p>Level reached: {gameState.level}</p>
      </Modal>
    </Card>
  );
};

export default Tetris;