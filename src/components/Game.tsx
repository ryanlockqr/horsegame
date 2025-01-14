import React, { useEffect, useRef } from "react";
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
const MIN_HURDLE_DISTANCE = 175; // Minimum distance between consecutive hurdles
const BACKGROUND_MOVE_SPEED = 3;

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs for animation
  const backgroundXRef = useRef(0); // Background position
  const horseYRef = useRef(GAME_HEIGHT - HORSE_HEIGHT - 10); // Horse's vertical position
  const isJumpingRef = useRef(false); // Track if the horse is mid-jump
  const obstaclesRef = useRef<
    { x: number; y: number; image: HTMLImageElement }[]
  >([]); // Track obstacles

  // Jump logic
  const jump = () => {
    if (isJumpingRef.current) return; // Prevent multiple jumps
    isJumpingRef.current = true;

    const originalY = GAME_HEIGHT - HORSE_HEIGHT - 10; // Ground position
    let velocity = -9; // Initial upward velocity
    const gravity = 0.5; // Gravity pulling down

    const jumpInterval = setInterval(() => {
      horseYRef.current += velocity;
      velocity += gravity;

      // Stop jumping when back on the ground
      if (horseYRef.current >= originalY) {
        horseYRef.current = originalY; // Reset to ground
        clearInterval(jumpInterval);
        isJumpingRef.current = false;
      }
    }, 20);
  };

  // Game loop
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
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update background position
        backgroundXRef.current -= BACKGROUND_MOVE_SPEED;
        if (backgroundXRef.current <= -GAME_WIDTH) {
          backgroundXRef.current = 0; // Reset when off-screen
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

        // Draw the horse with the appropriate sprite
        ctx.drawImage(
          isJumpingRef.current ? horseImageJumpSprite : horseImageNormalSprite,
          50, // Fixed horizontal position for the horse
          horseYRef.current, // Use ref-based y position
          HORSE_WIDTH,
          HORSE_HEIGHT
        );

        // Random hurdle spawning with minimum distance enforcement
        if (Math.random() < 0.02) {
          const lastObstacle =
            obstaclesRef.current[obstaclesRef.current.length - 1];
          const canSpawn =
            !lastObstacle || // No obstacle exists yet
            lastObstacle.x < GAME_WIDTH - MIN_HURDLE_DISTANCE; // Last obstacle is far enough away

          if (canSpawn) {
            // Randomly pick between hurdle1 and hurdle2
            const selectedHurdleImage =
              Math.random() < 0.5 ? hurdleImage1 : hurdleImage2;

            obstaclesRef.current.push({
              x: GAME_WIDTH,
              y: GAME_HEIGHT - HURDLE_HEIGHT - 6, // Ground position
              image: selectedHurdleImage, // Store the selected image
            });
          }
        }

        // Move and draw obstacles
        obstaclesRef.current = obstaclesRef.current.filter((obstacle) => {
          // Move the obstacle to the left
          obstacle.x -= BACKGROUND_MOVE_SPEED;

          // Draw the obstacle
          ctx.drawImage(
            obstacle.image, // Use the specific image for this obstacle
            obstacle.x,
            obstacle.y,
            HURDLE_WIDTH,
            HURDLE_HEIGHT
          );

          // Remove the obstacle if it goes off-screen
          return obstacle.x + HURDLE_WIDTH > 0;
        });
      }

      // Request the next frame
      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId); // Clean up on unmount
  }, []); // Empty dependency array to ensure one-time setup

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
