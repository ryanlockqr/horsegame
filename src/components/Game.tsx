import React, { useEffect, useRef, useState } from "react";
import "../styles/Game.css";
import backgroundImage from "../assets/images/background.png";
import horseImageNormal from "../assets/images/normal.png";
import horseImageJump from "../assets/images/jumping.png";
import hurdleImageSrc1 from "../assets/images/hurdle1.png";
import hurdleImageSrc2 from "../assets/images/hurdle2.png";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const HORSE_WIDTH = 65;
const HORSE_HEIGHT = 50;
const HURDLE_WIDTH = 50;
const HURDLE_HEIGHT = 70;
const MIN_HURDLE_DISTANCE = 175;
const BACKGROUND_MOVE_SPEED = 3;

// Hurdle colors to detect
const RED_HURDLE_COLOR = { r: 238, g: 22, b: 25 };
const YELLOW_HURDLE_COLOR = { r: 255, g: 240, b: 0 };
const COLOR_TOLERANCE = 10; // allow

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const backgroundXRef = useRef(0);
  const horseYRef = useRef(GAME_HEIGHT - HORSE_HEIGHT - 10);
  const isJumpingRef = useRef(false);
  const obstaclesRef = useRef<
    { x: number; y: number; image: HTMLImageElement }[]
  >([]);
  const [gameOver, setGameOver] = useState(false);

  const colorsMatch = (
    r1: number,
    g1: number,
    b1: number,
    r2: number,
    g2: number,
    b2: number
  ) => {
    return (
      Math.abs(r1 - r2) <= COLOR_TOLERANCE &&
      Math.abs(g1 - g2) <= COLOR_TOLERANCE &&
      Math.abs(b1 - b2) <= COLOR_TOLERANCE
    );
  };

  const detectColorCollision = (ctx: CanvasRenderingContext2D): boolean => {
    const horseX = 50; // Horse's fixed x-position
    const horseY = horseYRef.current;

    // Get the image data for the horse's area
    const imageData = ctx.getImageData(
      horseX,
      horseY,
      HORSE_WIDTH,
      HORSE_HEIGHT
    );
    const { data } = imageData;

    // Loop through pixels in the horse's area
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]; // Red
      const g = data[i + 1]; // Green
      const b = data[i + 2]; // Blue

      // Check against hurdle colors
      if (
        colorsMatch(
          r,
          g,
          b,
          RED_HURDLE_COLOR.r,
          RED_HURDLE_COLOR.g,
          RED_HURDLE_COLOR.b
        ) ||
        colorsMatch(
          r,
          g,
          b,
          YELLOW_HURDLE_COLOR.r,
          YELLOW_HURDLE_COLOR.g,
          YELLOW_HURDLE_COLOR.b
        )
      ) {
        return true; // Collision detected
      }
    }

    return false; // No collision detected
  };

  const jump = () => {
    if (isJumpingRef.current || gameOver) return;
    isJumpingRef.current = true;

    const originalY = GAME_HEIGHT - HORSE_HEIGHT - 10;
    let velocity = -10; // initial jump velocity
    const gravity = 0.5; // gravity force

    const jumpInterval = setInterval(() => {
      horseYRef.current += velocity;
      velocity += gravity;

      if (horseYRef.current >= originalY) {
        horseYRef.current = originalY;
        clearInterval(jumpInterval);
        isJumpingRef.current = false;
      }
    }, 20);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const background = new Image();
    background.src = backgroundImage;

    const horseImageNormalSprite = new Image();
    horseImageNormalSprite.src = horseImageNormal;

    const horseImageJumpSprite = new Image();
    horseImageJumpSprite.src = horseImageJump;

    const hurdleImage1 = new Image();
    hurdleImage1.src = hurdleImageSrc1;

    const hurdleImage2 = new Image();
    hurdleImage2.src = hurdleImageSrc2;

    const gameLoop = () => {
      if (ctx && canvas) {
        // Stop the game loop if game over
        if (gameOver) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "black";
          ctx.font = "48px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Game Over", GAME_WIDTH / 2, GAME_HEIGHT / 2);

          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update background position
        backgroundXRef.current -= BACKGROUND_MOVE_SPEED;
        if (backgroundXRef.current <= -GAME_WIDTH) {
          backgroundXRef.current = 0;
        }

        // Draw the background
        ctx.drawImage(
          background,
          backgroundXRef.current,
          0,
          GAME_WIDTH,
          GAME_HEIGHT
        );
        ctx.drawImage(
          background,
          backgroundXRef.current + GAME_WIDTH,
          0,
          GAME_WIDTH,
          GAME_HEIGHT
        );

        // Draw the horse
        ctx.drawImage(
          isJumpingRef.current ? horseImageJumpSprite : horseImageNormalSprite,
          50,
          horseYRef.current,
          HORSE_WIDTH,
          HORSE_HEIGHT
        );

        // Random hurdle spawning
        if (Math.random() < 0.02) {
          const lastObstacle =
            obstaclesRef.current[obstaclesRef.current.length - 1];
          const canSpawn =
            !lastObstacle || lastObstacle.x < GAME_WIDTH - MIN_HURDLE_DISTANCE;

          if (canSpawn) {
            const selectedHurdleImage =
              Math.random() < 0.5 ? hurdleImage1 : hurdleImage2;
            obstaclesRef.current.push({
              x: GAME_WIDTH,
              y: GAME_HEIGHT - HURDLE_HEIGHT - 3,
              image: selectedHurdleImage,
            });
          }
        }

        // Move and draw obstacles
        obstaclesRef.current = obstaclesRef.current.filter((obstacle) => {
          obstacle.x -= BACKGROUND_MOVE_SPEED;

          ctx.drawImage(
            obstacle.image,
            obstacle.x,
            obstacle.y,
            HURDLE_WIDTH,
            HURDLE_HEIGHT
          );

          return obstacle.x + HURDLE_WIDTH > 0;
        });

        // Check for color collision
        if (detectColorCollision(ctx)) {
          setGameOver(true);
          return; // Stop further game processing
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Space" || e.key === " ") {
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="game-canvas"
      />
    </div>
  );
};
