"use client";

import { useAchievements } from "@/contexts/AchievementContext";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SnakeGameProps {
  className?: string;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREASE = 5;
const MIN_SPEED = 60;

const SnakeGame: React.FC<SnakeGameProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">(
    "idle",
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const { unlockAchievement } = useAchievements();

  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Position>({ x: 15, y: 10 });
  const speedRef = useRef(INITIAL_SPEED);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snakeRef.current.some((seg) => seg.x === newFood.x && seg.y === newFood.y)
    );
    return newFood;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Food (glowing red)
    const food = foodRef.current;
    ctx.shadowColor = "#ff4444";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ff4444";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const progress = index / snake.length;

      if (isHead) {
        ctx.shadowColor = "#4ade80";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#4ade80";
      } else {
        ctx.shadowBlur = 0;
        // Gradient from green to teal along the body
        const r = Math.floor(74 - progress * 30);
        const g = Math.floor(222 - progress * 80);
        const b = Math.floor(128 + progress * 60);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      }

      const radius = isHead ? 4 : 3;
      const padding = isHead ? 1 : 2;

      ctx.beginPath();
      ctx.roundRect(
        segment.x * CELL_SIZE + padding,
        segment.y * CELL_SIZE + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2,
        radius,
      );
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }, []);

  const gameStep = useCallback(() => {
    directionRef.current = nextDirectionRef.current;
    const snake = [...snakeRef.current];
    const head = { ...snake[0] };

    switch (directionRef.current) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      setGameState("gameover");
      return;
    }

    // Self collision
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      setGameState("gameover");
      return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      const newScore = score + 10;
      setScore(newScore);

      if (newScore > 0) {
        unlockAchievement("gamer");
      }

      if (newScore > highScore) setHighScore(newScore);
      foodRef.current = generateFood();
      // Speed up
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREASE);
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    draw();
  }, [score, highScore, draw, generateFood, unlockAchievement]);

  // Game loop
  useEffect(() => {
    if (gameState === "playing") {
      const loop = () => {
        gameStep();
        gameLoopRef.current = setTimeout(loop, speedRef.current);
      };
      gameLoopRef.current = setTimeout(loop, speedRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [gameState, gameStep]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      const dir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (dir !== "DOWN") nextDirectionRef.current = "UP";
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
          if (dir !== "UP") nextDirectionRef.current = "DOWN";
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
          if (dir !== "RIGHT") nextDirectionRef.current = "LEFT";
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
          if (dir !== "LEFT") nextDirectionRef.current = "RIGHT";
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    foodRef.current = generateFood();
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameState("playing");
    draw();
  };

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div
      className={`flex flex-col items-center justify-center h-full bg-[#0a0a0a] ${className}`}
    >
      {/* Score bar */}
      <div className="flex items-center justify-between w-full px-4 py-2 bg-[#151515] border-b border-gray-800">
        <div className="text-sm text-gray-400">
          Score: <span className="text-green-400 font-bold">{score}</span>
        </div>
        <div className="text-sm text-gray-400">
          Best: <span className="text-yellow-400 font-bold">{highScore}</span>
        </div>
      </div>

      {/* Game canvas */}
      <div className="flex-grow flex items-center justify-center relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border border-gray-800 rounded"
        />

        {/* Overlay */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              {gameState === "gameover" && (
                <>
                  <h2 className="text-2xl font-bold text-red-400 mb-2">
                    Game Over!
                  </h2>
                  <p className="text-gray-400 mb-4">Score: {score}</p>
                </>
              )}
              {gameState === "idle" && (
                <>
                  <h2 className="text-2xl font-bold text-green-400 mb-2">
                    🐍 Snake
                  </h2>
                  <p className="text-gray-400 mb-4 text-sm">
                    Use WASD or arrow keys
                  </p>
                </>
              )}
              <button
                onClick={startGame}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                {gameState === "gameover" ? "Play Again" : "Start Game"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
