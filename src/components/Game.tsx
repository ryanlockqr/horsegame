import React, { useEffect, useRef, useState } from "react";
import { Horse } from "../types/GameTypes";
import "../styles/Game.css";
import backgroundImage from "../assets/images/background.png"; // Background image import

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const HORSE_WIDTH = 60;
const HORSE_HEIGHT = 40;

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [horse, setHorse] = useState<Horse>({
    position: { x: 50, y: GAME_HEIGHT - HORSE_HEIGHT - 10 },
    speed: 5,
    baseSpeed: 5,
    isJumping: false,
    effects: {
      speedBoost: 0,
      shield: false,
    },
  });

  const backgroundXRef = useRef(0); // Ref for tracking background position

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          moveHorse("right");
          break;
        case "ArrowLeft":
          moveHorse("left");
          break;
        case "Space":
        case " ":
          jump();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const moveHorse = (direction: "left" | "right") => {
    setHorse((prev) => {
      const newX =
        direction === "right"
          ? Math.min(prev.position.x + prev.speed, GAME_WIDTH - HORSE_WIDTH)
          : Math.max(prev.position.x - prev.speed, 0);

      return {
        ...prev,
        position: {
          ...prev.position,
          x: newX,
        },
      };
    });
  };

  const jump = () => {
    if (!horse.isJumping) {
      setHorse((prev) => ({ ...prev, isJumping: true }));
      const jumpHeight = 100;
      const jumpDuration = 500;

      // Jump up
      const originalY = horse.position.y;
      const jumpUp = setInterval(() => {
        setHorse((prev) => ({
          ...prev,
          position: {
            ...prev.position,
            y: Math.max(prev.position.y - 5, originalY - jumpHeight),
          },
        }));
      }, 20);

      // Return to ground
      setTimeout(() => {
        clearInterval(jumpUp);
        const fallDown = setInterval(() => {
          setHorse((prev) => {
            const newY = Math.min(
              prev.position.y + 5,
              GAME_HEIGHT - HORSE_HEIGHT - 10
            );
            if (newY === GAME_HEIGHT - HORSE_HEIGHT - 10) {
              clearInterval(fallDown);
              setHorse((p) => ({ ...p, isJumping: false }));
            }
            return {
              ...prev,
              position: {
                ...prev.position,
                y: newY,
              },
            };
          });
        }, 20);
      }, jumpDuration / 2);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const background = new Image();
    background.src = backgroundImage;

    const gameLoop = () => {
      if (ctx && canvas) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update background position (ref-based)
        backgroundXRef.current -= 2;
        if (backgroundXRef.current <= -GAME_WIDTH) {
          backgroundXRef.current = 0; // Reset position when fully off-screen
        }

        // Draw the background (seamless scrolling effect)
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
        ctx.fillStyle = "blue";
        ctx.fillRect(
          horse.position.x,
          horse.position.y,
          HORSE_WIDTH,
          HORSE_HEIGHT
        );
      }

      // Request the next frame
      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId); // Clean up
  }, [horse]);

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
