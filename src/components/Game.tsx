import React, { useEffect, useRef, useState } from "react";
import "../styles/Game.css";
import backgroundImage from "../assets/images/background.png"; // Background image import
import horseImageNormal from "../assets/images/normal.png"; // Replace with your actual file path

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const HORSE_WIDTH = 120;
const HORSE_HEIGHT = 80;

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Horse state
  const [horse, setHorse] = useState({
    position: { x: 50 }, // Horizontal position only
    speed: 5,
  });

  // Refs for animation
  const backgroundXRef = useRef(0); // Background position
  const horseYRef = useRef(GAME_HEIGHT - HORSE_HEIGHT - 10); // Horse's vertical position
  const isJumpingRef = useRef(false); // Track if the horse is mid-jump

  // Keypress handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Space":
        case " ":
          jump();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Jump logic
  const jump = () => {
    if (isJumpingRef.current) return; // Prevent multiple jumps
    isJumpingRef.current = true;

    const originalY = GAME_HEIGHT - HORSE_HEIGHT - 10; // Ground position
    let velocity = -9; // Initial upward velocity
    const gravity = 0.6; // Gravity pulling down

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

    const horseImage = new Image();
    horseImage.src = horseImageNormal;

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
          horse.position.x,
          horseYRef.current, // Use ref-based y position
          HORSE_WIDTH,
          HORSE_HEIGHT
        );
      }

      // Request the next frame
      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId); // Clean up on unmount
  }, []); // Empty dependency array to ensure one-time setup

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
