"use client";
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  closestCenter,
  DragEndEvent,
  DragMoveEvent,
} from "@dnd-kit/core";
import { Resizable } from "re-resizable";

interface ComicPanelLayoutProps {
  variant?: "variant1" | "variant2" | "variant3";
  children?: React.ReactNode[];
}

const ComicEffect = ({
  id,
  text,
  position,
  setPosition,
  size,
  setSize,
  className = "",
  animate = false,
}: {
  id: string;
  text: string;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  size: { width: number; height: number };
  setSize: (size: { width: number; height: number }) => void;
  className?: string;
  animate?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const x = transform ? position.x + transform.x : position.x;
  const y = transform ? position.y + transform.y : position.y;
  const style = {
    position: "absolute" as const,
    left: x,
    top: y,
    zIndex: isDragging ? 50 : 20,
    cursor: "grab",
    touchAction: "none" as const,
  };
  return (
    <Resizable
      size={size}
      minWidth={60}
      minHeight={40}
      maxWidth={400}
      maxHeight={200}
      onResizeStop={(_, __, ref, d) => {
        const newSize = {
          width: size.width + d.width,
          height: size.height + d.height,
        };
        setSize(newSize);
      }}
      style={style}
      enable={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      {...listeners}
      {...attributes}
    >
      <div
        className={`w-full h-full flex items-center justify-center text-3xl font-extrabold text-yellow-400 drop-shadow-lg pointer-events-auto select-none ${className} ${
          animate ? "animate-bounce animate-pulse" : ""
        }`}
      >
        {text}
      </div>
    </Resizable>
  );
};

interface SpeechBubbleProps {
  id: string;
  text: string;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  size: { width: number; height: number };
  setSize: (size: { width: number; height: number }) => void;
  fontSize?: string;
  className?: string;
  parentId: string;
}

const SpeechBubble = ({
  id,
  text,
  position,
  setPosition,
  size,
  setSize,
  fontSize = "text-2xl",
  className = "",
  parentId,
}: SpeechBubbleProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const x = transform ? position.x + transform.x : position.x;
  const y = transform ? position.y + transform.y : position.y;
  const style = {
    position: "absolute" as const,
    left: x,
    top: y,
    zIndex: isDragging ? 50 : 20,
    cursor: "grab",
    touchAction: "none" as const,
  };
  return (
    <Resizable
      size={size}
      minWidth={80}
      minHeight={40}
      maxWidth={600}
      maxHeight={300}
      onResizeStop={(_, __, ref, d) => {
        const newSize = {
          width: size.width + d.width,
          height: size.height + d.height,
        };
        setSize(newSize);
      }}
      style={style}
      enable={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      {...listeners}
      {...attributes}
    >
      <div
        className={`w-full h-full bg-white border-8 border-blue-500 rounded-3xl px-6 py-4 text-black font-bold shadow-lg pointer-events-auto select-none flex items-center justify-center ${fontSize} ${className}`}
        data-parent={parentId}
      >
        {text}
      </div>
    </Resizable>
  );
};

// Halftone background pattern
const HalftoneBG = () => (
  <div
    className="pointer-events-none absolute inset-0 z-0 opacity-20"
    style={{
      backgroundImage:
        "radial-gradient(circle, #eab308 1.5px, transparent 1.5px)",
      backgroundSize: "18px 18px",
    }}
  />
);

const panelClass =
  "bg-white border-4 border-black rounded-xl shadow-xl z-10 transition-all duration-300 flex items-center justify-center overflow-hidden w-full h-full relative";

export const ComicPanelLayout: React.FC<ComicPanelLayoutProps> = ({
  variant = "variant1",
  children,
}) => {
  // State for positions and sizes
  const [bubblePositions, setBubblePositions] = useState({
    bubble1: { x: 40, y: 20 },
    bubble2: { x: 60, y: 40 },
    bubble3: { x: 80, y: 120 },
    bubble4: { x: 100, y: 100 },
    bubble5: { x: 120, y: 120 },
  });
  const [bubbleSizes, setBubbleSizes] = useState({
    bubble1: { width: 320, height: 120 },
    bubble2: { width: 120, height: 48 },
    bubble3: { width: 280, height: 120 },
    bubble4: { width: 400, height: 180 },
    bubble5: { width: 180, height: 80 },
  });
  const [effectPositions, setEffectPositions] = useState({
    boom: { x: 200, y: 0 },
    snap: { x: 60, y: 200 },
  });
  const [effectSizes, setEffectSizes] = useState({
    boom: { width: 180, height: 80 },
    snap: { width: 140, height: 60 },
  });
  const [activePanel, setActivePanel] = useState<string | null>(null);

  // Update position on every drag move
  const handleDragMove = (event: DragMoveEvent) => {
    const { delta } = event;
    const id = event.active.id as string;
    if (id in bubblePositions) {
      setBubblePositions((prev) => ({
        ...prev,
        [id]: {
          x: prev[id as keyof typeof prev].x + (delta?.x || 0),
          y: prev[id as keyof typeof prev].y + (delta?.y || 0),
        },
      }));
    } else if (id in effectPositions) {
      setEffectPositions((prev) => ({
        ...prev,
        [id]: {
          x: prev[id as keyof typeof prev].x + (delta?.x || 0),
          y: prev[id as keyof typeof prev].y + (delta?.y || 0),
        },
      }));
    }
  };

  // No-op for drag end (position is already updated on move)
  const handleDragEnd = () => {};

  if (variant === "variant1") {
    // Reference: 3 columns x 2 rows, with abstract, variable speech bubbles
    return (
      <DndContext
        collisionDetection={closestCenter}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="relative min-h-screen w-full overflow-hidden bg-yellow-100 border-8 border-dotted border-red-500 flex items-center justify-center">
          <HalftoneBG />
          {/* Comic Effects (BOOM, SNAP) - top-level, not in panels */}
          <ComicEffect
            id="boom"
            text="BOOM!"
            position={effectPositions.boom}
            setPosition={(pos) =>
              setEffectPositions((prev) => ({ ...prev, boom: pos }))
            }
            size={effectSizes.boom}
            setSize={(size) =>
              setEffectSizes((prev) => ({ ...prev, boom: size }))
            }
            className="text-5xl md:text-6xl"
            animate={activePanel === "c"}
          />
          <ComicEffect
            id="snap"
            text="SNAP!"
            position={effectPositions.snap}
            setPosition={(pos) =>
              setEffectPositions((prev) => ({ ...prev, snap: pos }))
            }
            size={effectSizes.snap}
            setSize={(size) =>
              setEffectSizes((prev) => ({ ...prev, snap: size }))
            }
            className="text-4xl md:text-5xl"
            animate={activePanel === "f"}
          />
          <div
            className="relative w-full h-full min-h-[80vh] grid grid-cols-3 grid-rows-2 gap-6 md:gap-8 z-10 p-2 md:p-8"
            style={{
              gridTemplateAreas: `
              'a b c'
              'd e f'
            `,
            }}
          >
            {/* Panels */}
            <div
              className={`${panelClass}`}
              style={{ gridArea: "a" }}
              onMouseEnter={() => setActivePanel("a")}
              onMouseLeave={() =>
                setActivePanel((prev) => (prev === "a" ? null : prev))
              }
              onClick={() => setActivePanel("a")}
            >
              <SpeechBubble
                id="bubble1"
                text="A big intro or image!"
                position={bubblePositions.bubble1}
                setPosition={(pos) =>
                  setBubblePositions((prev) => ({ ...prev, bubble1: pos }))
                }
                size={bubbleSizes.bubble1}
                setSize={(size) =>
                  setBubbleSizes((prev) => ({ ...prev, bubble1: size }))
                }
                fontSize="text-4xl md:text-5xl"
                parentId="a"
              />
            </div>
            <div
              className={`${panelClass}`}
              style={{ gridArea: "b" }}
              onMouseEnter={() => setActivePanel("b")}
              onMouseLeave={() =>
                setActivePanel((prev) => (prev === "b" ? null : prev))
              }
              onClick={() => setActivePanel("b")}
            >
              <SpeechBubble
                id="bubble2"
                text="Quick note"
                position={bubblePositions.bubble2}
                setPosition={(pos) =>
                  setBubblePositions((prev) => ({ ...prev, bubble2: pos }))
                }
                size={bubbleSizes.bubble2}
                setSize={(size) =>
                  setBubbleSizes((prev) => ({ ...prev, bubble2: size }))
                }
                fontSize="text-base md:text-lg"
                parentId="b"
              />
            </div>
            <div
              className={`${panelClass}`}
              style={{ gridArea: "c" }}
              onMouseEnter={() => setActivePanel("c")}
              onMouseLeave={() =>
                setActivePanel((prev) => (prev === "c" ? null : prev))
              }
              onClick={() => setActivePanel("c")}
            />
            <div
              className={`${panelClass}`}
              style={{ gridArea: "d" }}
              onMouseEnter={() => setActivePanel("d")}
              onMouseLeave={() =>
                setActivePanel((prev) => (prev === "d" ? null : prev))
              }
              onClick={() => setActivePanel("d")}
            >
              <SpeechBubble
                id="bubble3"
                text="A longer story bubble for more context or even an image!"
                position={bubblePositions.bubble3}
                setPosition={(pos) =>
                  setBubblePositions((prev) => ({ ...prev, bubble3: pos }))
                }
                size={bubbleSizes.bubble3}
                setSize={(size) =>
                  setBubbleSizes((prev) => ({ ...prev, bubble3: size }))
                }
                fontSize="text-2xl md:text-3xl"
                parentId="d"
              />
            </div>
            <div
              className={`${panelClass}`}
              style={{ gridArea: "e" }}
              onMouseEnter={() => setActivePanel("e")}
              onMouseLeave={() =>
                setActivePanel((prev) => (prev === "e" ? null : prev))
              }
              onClick={() => setActivePanel("e")}
            >
              <SpeechBubble
                id="bubble4"
                text="The main event!"
                position={bubblePositions.bubble4}
                setPosition={(pos) =>
                  setBubblePositions((prev) => ({ ...prev, bubble4: pos }))
                }
                size={bubbleSizes.bubble4}
                setSize={(size) =>
                  setBubbleSizes((prev) => ({ ...prev, bubble4: size }))
                }
                fontSize="text-5xl md:text-6xl"
                parentId="e"
              />
            </div>
            <div
              className={`${panelClass}`}
              style={{ gridArea: "f" }}
              onMouseEnter={() => setActivePanel("f")}
              onMouseLeave={() =>
                setActivePanel((prev) => (prev === "f" ? null : prev))
              }
              onClick={() => setActivePanel("f")}
            >
              <SpeechBubble
                id="bubble5"
                text="Side remark"
                position={bubblePositions.bubble5}
                setPosition={(pos) =>
                  setBubblePositions((prev) => ({ ...prev, bubble5: pos }))
                }
                size={bubbleSizes.bubble5}
                setSize={(size) =>
                  setBubbleSizes((prev) => ({ ...prev, bubble5: size }))
                }
                fontSize="text-lg md:text-2xl"
                parentId="f"
              />
            </div>
          </div>
        </div>
      </DndContext>
    );
  }
  if (variant === "variant2") {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-yellow-100 border-8 border-dotted border-red-500 p-2 md:p-10 flex items-center justify-center">
        <HalftoneBG />
        <div className="relative w-full h-full grid grid-cols-1 md:grid-cols-3 grid-rows-6 md:grid-rows-2 gap-6 md:gap-8 z-10 p-2 md:p-8">
          <div className={panelClass} />
          <div className={panelClass} />
          <div className={panelClass} />
          <div className={panelClass} />
          <div className={panelClass} />
          <div className={panelClass} />
          <ComicEffect
            id="boom2"
            text="BOOM!"
            position={{ x: 700, y: 20 }}
            setPosition={(pos) =>
              setEffectPositions((prev) => ({ ...prev, boom: pos }))
            }
            size={{ width: 180, height: 80 }}
            setSize={(size) =>
              setEffectSizes((prev) => ({ ...prev, boom: size }))
            }
            className="top-2 right-8"
            animate={activePanel === "center-bubble"}
          />
          <ComicEffect
            id="snap2"
            text="SNAP!"
            position={{ x: 40, y: 400 }}
            setPosition={(pos) =>
              setEffectPositions((prev) => ({ ...prev, snap: pos }))
            }
            size={{ width: 140, height: 60 }}
            setSize={(size) =>
              setEffectSizes((prev) => ({ ...prev, snap: size }))
            }
            className="bottom-8 left-8"
            animate={activePanel === "center-bubble"}
          />
          <SpeechBubble
            id="center-bubble"
            text="Central bubble!"
            position={{ x: 300, y: 200 }}
            setPosition={(pos) =>
              setBubblePositions((prev) => ({ ...prev, bubble1: pos }))
            }
            size={{ width: 320, height: 120 }}
            setSize={(size) =>
              setBubbleSizes((prev) => ({ ...prev, bubble1: size }))
            }
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            parentId="center-bubble"
          />
        </div>
      </div>
    );
  }
  // variant3: 2x2 grid, with a large central effect
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-yellow-100 border-8 border-dotted border-red-500 p-2 md:p-10 flex items-center justify-center">
      <HalftoneBG />
      <div className="relative w-full h-full grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-6 md:gap-8 z-10 p-2 md:p-8">
        <div className={panelClass} />
        <div className={panelClass} />
        <div className={panelClass} />
        <div className={panelClass} />
        <ComicEffect
          id="pow3"
          text="POW!"
          position={{ x: 40, y: 20 }}
          setPosition={(pos) =>
            setEffectPositions((prev) => ({ ...prev, boom: pos }))
          }
          size={{ width: 180, height: 80 }}
          setSize={(size) =>
            setEffectSizes((prev) => ({ ...prev, boom: size }))
          }
          className="top-4 left-4"
          animate={activePanel === "pow3"}
        />
        <ComicEffect
          id="boom3"
          text="BOOM!"
          position={{ x: 600, y: 300 }}
          setPosition={(pos) =>
            setEffectPositions((prev) => ({ ...prev, boom: pos }))
          }
          size={{ width: 180, height: 80 }}
          setSize={(size) =>
            setEffectSizes((prev) => ({ ...prev, boom: size }))
          }
          className="bottom-8 right-8"
          animate={activePanel === "boom3"}
        />
        <SpeechBubble
          id="big-moment"
          text="Big moment!"
          position={{ x: 300, y: 100 }}
          setPosition={(pos) =>
            setBubblePositions((prev) => ({ ...prev, bubble1: pos }))
          }
          size={{ width: 320, height: 120 }}
          setSize={(size) =>
            setBubbleSizes((prev) => ({ ...prev, bubble1: size }))
          }
          className="top-1/3 left-1/2 -translate-x-1/2"
          parentId="big-moment"
        />
      </div>
    </div>
  );
};

export default ComicPanelLayout;
