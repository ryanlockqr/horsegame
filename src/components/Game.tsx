import React, { useEffect, useRef, useState } from "react";
import "../styles/Game.css";
import backgroundImage from "../assets/images/background.png"; // Background image import
import horseImageSrc from "../assets/images/normal.png"; // Horse image import
import hurdleImageSrc from "../assets/images/hurdle1.png"; // Hurdle image import

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const HORSE_WIDTH = 60;
const HORSE_HEIGHT = 40;
const HURDLE_WIDTH = 50;
const HURDLE_HEIGHT = 40;

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs for animation
  const backgroundXRef = useRef(0); // Background position
  const horseYRef = useRef(GAME_HEIGHT - HORSE_HEIGHT - 10); // Horse's vertical position
  const isJumpingRef = useRef(false); // Track if the horse is mid-jump
  const obstaclesRef = useRef<{ x: number; y: number }[]>([]); // Track obstacles

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

    const horseImage = new Image(); // Load the horse image
    horseImage.src = horseImageSrc;

    const hurdleImage = new Image(); // Load the hurdle image
    hurdleImage.src = hurdleImageSrc;

    let frameCount = 0; // Track frames for obstacle spawning

    const gameLoop = () => {
      if (ctx && canvas) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update background position
        backgroundXRef.current -= 3;
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

        // Draw the horse
        ctx.drawImage(
          horseImage,
          50, // Fixed horizontal position for the horse
          horseYRef.current, // Use ref-based y position
          HORSE_WIDTH,
          HORSE_HEIGHT
        );

        // Handle obstacle spawning
        if (frameCount % 120 === 0) {
          // Spawn a new obstacle every 120 frames (~2 seconds at 60 FPS)
          obstaclesRef.current.push({
            x: GAME_WIDTH,
            y: GAME_HEIGHT - HURDLE_HEIGHT - 10, // Ground position
          });
        }

        // Move and draw obstacles
        obstaclesRef.current = obstaclesRef.current.filter((obstacle) => {
          // Move the obstacle to the left
          obstacle.x -= 3;

          // Draw the obstacle
          ctx.drawImage(
            hurdleImage,
            obstacle.x,
            obstacle.y,
            HURDLE_WIDTH,
            HURDLE_HEIGHT
          );

          // Remove the obstacle if it goes off-screen
          return obstacle.x + HURDLE_WIDTH > 0;
        });

        frameCount++; // Increment the frame count
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
