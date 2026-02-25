"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface TetrisGameProps {
    className?: string;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 28;

type Board = (string | null)[][];

const TETROMINOS: { [key: string]: { shape: number[][]; color: string } } = {
    I: { shape: [[1, 1, 1, 1]], color: "#00f5ff" },
    O: { shape: [[1, 1], [1, 1]], color: "#ffd700" },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: "#a855f7" },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: "#4ade80" },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "#ef4444" },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: "#3b82f6" },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: "#f97316" },
};

const TETROMINO_KEYS = Object.keys(TETROMINOS);

interface Piece {
    shape: number[][];
    color: string;
    x: number;
    y: number;
    type: string;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ className = "" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nextCanvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<"idle" | "playing" | "paused" | "gameover">("idle");
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);

    const boardRef = useRef<Board>(createEmptyBoard());
    const currentPieceRef = useRef<Piece | null>(null);
    const nextPieceRef = useRef<string>(randomTetromino());
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
    const scoreRef = useRef(0);
    const linesRef = useRef(0);
    const levelRef = useRef(1);

    function createEmptyBoard(): Board {
        return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
    }

    function randomTetromino(): string {
        return TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
    }

    function spawnPiece(type: string): Piece {
        const t = TETROMINOS[type];
        return {
            shape: t.shape.map(row => [...row]),
            color: t.color,
            x: Math.floor(BOARD_WIDTH / 2) - Math.floor(t.shape[0].length / 2),
            y: 0,
            type,
        };
    }

    function rotatePiece(shape: number[][]): number[][] {
        const rows = shape.length;
        const cols = shape[0].length;
        const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                rotated[c][rows - 1 - r] = shape[r][c];
            }
        }
        return rotated;
    }

    function isValidPosition(board: Board, piece: Piece): boolean {
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c]) {
                    const newX = piece.x + c;
                    const newY = piece.y + r;
                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return false;
                    if (newY >= 0 && board[newY][newX]) return false;
                }
            }
        }
        return true;
    }

    function lockPiece(board: Board, piece: Piece): Board {
        const newBoard = board.map(row => [...row]);
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c]) {
                    const y = piece.y + r;
                    const x = piece.x + c;
                    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                        newBoard[y][x] = piece.color;
                    }
                }
            }
        }
        return newBoard;
    }

    function clearLines(board: Board): { board: Board; cleared: number } {
        const newBoard = board.filter(row => row.some(cell => cell === null));
        const cleared = BOARD_HEIGHT - newBoard.length;
        while (newBoard.length < BOARD_HEIGHT) {
            newBoard.unshift(Array(BOARD_WIDTH).fill(null));
        }
        return { board: newBoard, cleared };
    }

    function getGhostY(board: Board, piece: Piece): number {
        let ghostY = piece.y;
        const ghost = { ...piece, y: ghostY };
        while (isValidPosition(board, { ...ghost, y: ghost.y + 1 })) {
            ghost.y++;
        }
        return ghost.y;
    }

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const board = boardRef.current;
        const piece = currentPieceRef.current;

        // Background
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= BOARD_WIDTH; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
            ctx.stroke();
        }
        for (let y = 0; y <= BOARD_HEIGHT; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
            ctx.stroke();
        }

        // Board cells
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            for (let c = 0; c < BOARD_WIDTH; c++) {
                if (board[r][c]) {
                    drawCell(ctx, c, r, board[r][c]!);
                }
            }
        }

        // Ghost piece
        if (piece) {
            const ghostY = getGhostY(board, piece);
            for (let r = 0; r < piece.shape.length; r++) {
                for (let c = 0; c < piece.shape[r].length; c++) {
                    if (piece.shape[r][c]) {
                        const x = (piece.x + c) * CELL_SIZE;
                        const y = (ghostY + r) * CELL_SIZE;
                        ctx.strokeStyle = piece.color + "40";
                        ctx.lineWidth = 1;
                        ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                    }
                }
            }
        }

        // Current piece
        if (piece) {
            for (let r = 0; r < piece.shape.length; r++) {
                for (let c = 0; c < piece.shape[r].length; c++) {
                    if (piece.shape[r][c]) {
                        drawCell(ctx, piece.x + c, piece.y + r, piece.color);
                    }
                }
            }
        }

        // Draw next piece preview
        const nextCanvas = nextCanvasRef.current;
        if (nextCanvas) {
            const nctx = nextCanvas.getContext("2d");
            if (nctx) {
                nctx.fillStyle = "#111";
                nctx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
                const next = TETROMINOS[nextPieceRef.current];
                const offsetX = (4 - next.shape[0].length) / 2;
                const offsetY = (4 - next.shape.length) / 2;
                for (let r = 0; r < next.shape.length; r++) {
                    for (let c = 0; c < next.shape[r].length; c++) {
                        if (next.shape[r][c]) {
                            const size = 20;
                            const x = (offsetX + c) * size;
                            const y = (offsetY + r) * size;
                            nctx.fillStyle = next.color;
                            nctx.beginPath();
                            nctx.roundRect(x + 1, y + 1, size - 2, size - 2, 3);
                            nctx.fill();
                        }
                    }
                }
            }
        }
    }, []);

    function drawCell(ctx: CanvasRenderingContext2D, col: number, row: number, color: string) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 3);
        ctx.fill();

        // Highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(x + 3, y + 3, CELL_SIZE - 6, 2);

        ctx.shadowBlur = 0;
    }

    const gameStep = useCallback(() => {
        const board = boardRef.current;
        let piece = currentPieceRef.current;

        if (!piece) {
            piece = spawnPiece(nextPieceRef.current);
            nextPieceRef.current = randomTetromino();
            if (!isValidPosition(board, piece)) {
                setGameState("gameover");
                return;
            }
            currentPieceRef.current = piece;
            draw();
            return;
        }

        const moved = { ...piece, y: piece.y + 1 };
        if (isValidPosition(board, moved)) {
            currentPieceRef.current = moved;
        } else {
            // Lock
            let newBoard = lockPiece(board, piece);
            const { board: clearedBoard, cleared } = clearLines(newBoard);
            boardRef.current = clearedBoard;

            // Score: 100, 300, 500, 800 for 1, 2, 3, 4 lines
            const lineScores = [0, 100, 300, 500, 800];
            const addedScore = (lineScores[cleared] || 0) * levelRef.current;
            scoreRef.current += addedScore;
            linesRef.current += cleared;
            levelRef.current = Math.floor(linesRef.current / 10) + 1;

            setScore(scoreRef.current);
            setLines(linesRef.current);
            setLevel(levelRef.current);

            currentPieceRef.current = null;
        }
        draw();
    }, [draw]);

    // Game loop
    useEffect(() => {
        if (gameState === "playing") {
            const speed = Math.max(80, 800 - (levelRef.current - 1) * 80);
            const loop = () => {
                gameStep();
                gameLoopRef.current = setTimeout(loop, speed);
            };
            gameLoopRef.current = setTimeout(loop, speed);
        }
        return () => {
            if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
        };
    }, [gameState, gameStep]);

    // Keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== "playing") return;
            const board = boardRef.current;
            const piece = currentPieceRef.current;
            if (!piece) return;

            switch (e.key) {
                case "ArrowLeft":
                case "a": {
                    const moved = { ...piece, x: piece.x - 1 };
                    if (isValidPosition(board, moved)) {
                        currentPieceRef.current = moved;
                        draw();
                    }
                    e.preventDefault();
                    break;
                }
                case "ArrowRight":
                case "d": {
                    const moved = { ...piece, x: piece.x + 1 };
                    if (isValidPosition(board, moved)) {
                        currentPieceRef.current = moved;
                        draw();
                    }
                    e.preventDefault();
                    break;
                }
                case "ArrowDown":
                case "s": {
                    const moved = { ...piece, y: piece.y + 1 };
                    if (isValidPosition(board, moved)) {
                        currentPieceRef.current = moved;
                        draw();
                    }
                    e.preventDefault();
                    break;
                }
                case "ArrowUp":
                case "w": {
                    const rotated = { ...piece, shape: rotatePiece(piece.shape) };
                    if (isValidPosition(board, rotated)) {
                        currentPieceRef.current = rotated;
                        draw();
                    }
                    e.preventDefault();
                    break;
                }
                case " ": {
                    // Hard drop
                    const ghostY = getGhostY(board, piece);
                    currentPieceRef.current = { ...piece, y: ghostY };
                    draw();
                    gameStep();
                    e.preventDefault();
                    break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState, draw, gameStep]);

    const startGame = () => {
        boardRef.current = createEmptyBoard();
        currentPieceRef.current = null;
        nextPieceRef.current = randomTetromino();
        scoreRef.current = 0;
        linesRef.current = 0;
        levelRef.current = 1;
        setScore(0);
        setLines(0);
        setLevel(1);
        setGameState("playing");
    };

    useEffect(() => { draw(); }, [draw]);

    return (
        <div className={`flex h-full bg-[#0a0a0a] ${className}`}>
            {/* Game area */}
            <div className="flex-grow flex items-center justify-center">
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        width={BOARD_WIDTH * CELL_SIZE}
                        height={BOARD_HEIGHT * CELL_SIZE}
                        className="border border-gray-800 rounded"
                    />

                    {/* Overlay */}
                    {gameState !== "playing" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded">
                            <div className="text-center">
                                {gameState === "gameover" && (
                                    <>
                                        <h2 className="text-2xl font-bold text-red-400 mb-1">Game Over!</h2>
                                        <p className="text-gray-400 text-sm mb-1">Score: {score}</p>
                                        <p className="text-gray-400 text-sm mb-4">Lines: {lines}</p>
                                    </>
                                )}
                                {gameState === "idle" && (
                                    <>
                                        <h2 className="text-2xl font-bold text-purple-400 mb-2">🧱 Tetris</h2>
                                        <div className="text-gray-400 text-xs mb-4 space-y-1">
                                            <p>← → Move  |  ↑ Rotate</p>
                                            <p>↓ Soft drop  |  Space Hard drop</p>
                                        </div>
                                    </>
                                )}
                                <button
                                    onClick={startGame}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    {gameState === "gameover" ? "Play Again" : "Start Game"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Side panel */}
            <div className="w-32 p-3 flex flex-col gap-4 border-l border-gray-800">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Next</p>
                    <canvas
                        ref={nextCanvasRef}
                        width={80}
                        height={80}
                        className="border border-gray-800 rounded bg-[#111]"
                    />
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Score</p>
                    <p className="text-lg font-bold text-white">{score}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Lines</p>
                    <p className="text-lg font-bold text-cyan-400">{lines}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Level</p>
                    <p className="text-lg font-bold text-yellow-400">{level}</p>
                </div>
            </div>
        </div>
    );
};

export default TetrisGame;
