"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  useDraggable,
  closestCenter,
  DragEndEvent,
  DragMoveEvent,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Resizable } from "re-resizable";
import {
  BasicBalloon,
  SquaredBalloon,
  ConnectorBalloon,
  WarpedBalloon,
  BoomEffect,
  ComicGroup21,
  ComicGroup29,
  ComicGroup35,
  ComicGroup36,
  ComicGroup37,
  ComicEllipse39,
  ComicEllipse40,
  ComicEllipse41,
  ComicEllipse42,
} from "./svg/ComicSvgs";

interface ComicPanelLayoutProps {
  variant?: "variant1" | "variant2" | "variant3";
  children?: React.ReactNode[];
}

// Add default positions and sizes
const defaultBubblePositions = {
  bubble1: { x: 40, y: 20 },
  bubble2: { x: 60, y: 40 },
  bubble3: { x: 80, y: 120 },
  bubble4: { x: 100, y: 100 },
  bubble5: { x: 120, y: 120 },
};

const defaultBubbleSizes = {
  bubble1: { width: 320, height: 120 },
  bubble2: { width: 120, height: 48 },
  bubble3: { width: 280, height: 120 },
  bubble4: { width: 400, height: 180 },
  bubble5: { width: 180, height: 80 },
};

const defaultEffectPositions = {
  boom: { x: 200, y: 0 },
  snap: { x: 60, y: 200 },
};

const defaultEffectSizes = {
  boom: { width: 180, height: 80 },
  snap: { width: 140, height: 60 },
};

// Add touch interaction helpers
const getTouchCoordinates = (event: TouchEvent) => {
  const touch = event.touches[0];
  return {
    x: touch.clientX,
    y: touch.clientY,
  };
};

// Enhanced movement constraint constants
const MOVEMENT_THRESHOLD = {
  MOUSE: 0.95, // Higher precision for mouse
  TOUCH: 0.85, // Better control for touch
};

const MAX_MOVEMENT_PER_FRAME = {
  MOUSE: 25, // Slightly slower for better control
  TOUCH: 15, // Even slower for touch
};

// Allow speech bubbles to extend up to this many pixels outside their panel
const REPOSITION_RADIUS = 40;

// Helper functions (keep outside):
function rectsOverlap(r1, r2) {
  return !(
    r1.x + r1.width < r2.x ||
    r2.x + r2.width < r1.x ||
    r1.y + r1.height < r2.y ||
    r2.y + r2.height < r1.y
  );
}
function clampToAvoidSafeZone(panelRect, bubbleRect, safeZone) {
  let x = bubbleRect.x;
  let y = bubbleRect.y;
  if (rectsOverlap(bubbleRect, safeZone)) {
    if (
      bubbleRect.x + bubbleRect.width > safeZone.x &&
      bubbleRect.x < safeZone.x
    )
      x = safeZone.x - bubbleRect.width;
    if (
      bubbleRect.x < safeZone.x + safeZone.width &&
      bubbleRect.x + bubbleRect.width > safeZone.x + safeZone.width
    )
      x = safeZone.x + safeZone.width;
    if (
      bubbleRect.y + bubbleRect.height > safeZone.y &&
      bubbleRect.y < safeZone.y
    )
      y = safeZone.y - bubbleRect.height;
    if (
      bubbleRect.y < safeZone.y + safeZone.height &&
      bubbleRect.y + bubbleRect.height > safeZone.y + safeZone.height
    )
      y = safeZone.y + safeZone.height;
  }
  const clamped = clampBubbleToPanelWithRadius(panelRect, {
    ...bubbleRect,
    x,
    y,
  });
  return clamped;
}
function clampBubbleToPanelWithRadius(panelRect, bubbleRect) {
  const REPOSITION_RADIUS = 40;
  const centerX = bubbleRect.x + bubbleRect.width / 2;
  const centerY = bubbleRect.y + bubbleRect.height / 2;
  const minX = panelRect.x - REPOSITION_RADIUS + bubbleRect.width / 2;
  const maxX =
    panelRect.x + panelRect.width + REPOSITION_RADIUS - bubbleRect.width / 2;
  const minY = panelRect.y - REPOSITION_RADIUS + bubbleRect.height / 2;
  const maxY =
    panelRect.y + panelRect.height + REPOSITION_RADIUS - bubbleRect.height / 2;
  let clampedCenterX = Math.max(minX, Math.min(centerX, maxX));
  let clampedCenterY = Math.max(minY, Math.min(centerY, maxY));
  return {
    x: clampedCenterX - bubbleRect.width / 2,
    y: clampedCenterY - bubbleRect.height / 2,
  };
}

// Fix DraggableWrapper to forward refs with correct types
const DraggableWrapper = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ style?: React.CSSProperties; [key: string]: any }>
>(({ children, style, ...props }, ref) => {
  const [touchStartTime, setTouchStartTime] = useState(0);
  const touchTimeThreshold = 300; // ms threshold for long press

  const handleTouchStart = (e) => {
    setTouchStartTime(Date.now());
  };

  const handleTouchEnd = (e) => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration < touchTimeThreshold) {
      props.onClick?.(e);
    }
  };

  return (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
        touchAction: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        cursor: "grab",
        "&:active": {
          cursor: "grabbing",
        },
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
});

// Add cursor tracking helper
const getElementCenter = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

interface ComicEffectProps {
  id: string;
  text: string;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  size: { width: number; height: number };
  setSize: (size: { width: number; height: number }) => void;
  className?: string;
  animate?: boolean;
  style?: "boom" | "group21" | "group29" | "group35" | "group36" | "group37";
  showResizeHandles: boolean;
  handleStyles: any;
  handleComponent: any;
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
  style = "boom",
  showResizeHandles,
  handleStyles,
  handleComponent,
}: ComicEffectProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        type: "effect",
        current: { position, size },
      },
    });

  const [isResizing, setIsResizing] = useState(false);

  const getEffectComponent = () => {
    switch (style) {
      case "group21":
        return ComicGroup21;
      case "group29":
        return ComicGroup29;
      case "group35":
        return ComicGroup35;
      case "group36":
        return ComicGroup36;
      case "group37":
        return ComicGroup37;
      default:
        return BoomEffect;
    }
  };

  const EffectComponent = getEffectComponent();

  const containerStyle = {
    position: "absolute" as const,
    left: position.x,
    top: position.y,
    zIndex: isDragging || isResizing ? 999 : 100,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none" as const,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${
          isDragging ? 1.1 : 1
        }) ${animate ? "rotate(5deg)" : "rotate(0deg)"}`
      : `scale(1) ${animate ? "rotate(5deg)" : "rotate(0deg)"}`,
    transition: isDragging ? "none" : "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow:
      isDragging || isResizing
        ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    willChange: "transform, box-shadow, rotate",
    transformOrigin: "center center",
  };

  return (
    <DraggableWrapper
      ref={setNodeRef}
      style={containerStyle}
      {...attributes}
      {...listeners}
      className={`transform-gpu ${effectAnimationClass}`}
      id={id}
    >
      <Resizable
        size={size}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={(e, direction, ref, d) => {
          setIsResizing(false);
          setSize({
            width: size.width + d.width,
            height: size.height + d.height,
          });
        }}
        minWidth={80}
        minHeight={40}
        maxWidth={800}
        maxHeight={400}
        handleStyles={handleStyles}
        handleClasses={{
          top: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          right: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          bottom: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          left: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          topRight: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          bottomRight: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          bottomLeft: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          topLeft: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
        }}
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
        handleComponent={handleComponent}
      >
        <div className="relative w-full h-full">
          <EffectComponent
            width="100%"
            height="100%"
            className={`absolute inset-0 ${
              animate ? "animate-bounce animate-pulse" : ""
            } ${className}`}
          />
          <div
            className={`relative w-full h-full flex items-center justify-center text-3xl font-extrabold text-yellow-400 drop-shadow-lg pointer-events-auto select-none z-10`}
          >
            {text}
          </div>
        </div>
      </Resizable>
    </DraggableWrapper>
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
  style?: "basic" | "squared" | "connector" | "warped";
  showResizeHandles: boolean;
  handleStyles: any;
  handleComponent: any;
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
  style = "basic",
  showResizeHandles,
  handleStyles,
  handleComponent,
}: SpeechBubbleProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        type: "speech-bubble",
        current: { position, size },
      },
    });

  const [isResizing, setIsResizing] = useState(false);

  const getBubbleComponent = () => {
    switch (style) {
      case "squared":
        return SquaredBalloon;
      case "connector":
        return ConnectorBalloon;
      case "warped":
        return WarpedBalloon;
      default:
        return BasicBalloon;
    }
  };

  const BubbleComponent = getBubbleComponent();

  const containerStyle = {
    position: "absolute" as const,
    left: position.x,
    top: position.y,
    zIndex: isDragging || isResizing ? 999 : 100,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none" as const,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${
          isDragging ? 1.05 : 1
        })`
      : "scale(1)",
    transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow:
      isDragging || isResizing
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    willChange: "transform, box-shadow",
    transformOrigin: "center center",
  };

  return (
    <DraggableWrapper
      ref={setNodeRef}
      style={containerStyle}
      {...attributes}
      {...listeners}
      className={`transform-gpu ${bubbleAnimationClass}`}
      id={id}
    >
      <Resizable
        size={size}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={(e, direction, ref, d) => {
          setIsResizing(false);
          setSize({
            width: size.width + d.width,
            height: size.height + d.height,
          });
        }}
        minWidth={120}
        minHeight={60}
        maxWidth={1000}
        maxHeight={500}
        handleStyles={handleStyles}
        handleClasses={{
          top: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          right: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          bottom: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          left: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          topRight: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          bottomRight: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          bottomLeft: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
          topLeft: `transition-colors ${
            showResizeHandles ? "hover:bg-blue-600" : ""
          }`,
        }}
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
        handleComponent={handleComponent}
      >
        <div className="relative w-full h-full">
          <BubbleComponent
            width="100%"
            height="100%"
            className={`absolute inset-0 ${className}`}
          />
          <div
            className={`relative w-full h-full flex items-center justify-center ${fontSize} font-bold text-black pointer-events-auto select-none z-10`}
            data-parent={parentId}
          >
            {text}
          </div>
        </div>
      </Resizable>
    </DraggableWrapper>
  );
};

// Halftone background pattern
const HalftoneBG = () => (
  <div
    className="pointer-events-none absolute inset-0 z-0 opacity-20"
    style={{
      backgroundImage: "radial-gradient(circle, #eab308 1px, transparent 1px)",
      backgroundSize: "clamp(8px, 1.5vw, 18px) clamp(8px, 1.5vw, 18px)",
    }}
  />
);

const panelClass = `
  bg-white 
  border-2
  sm:border-4 
  border-black 
  rounded-lg
  sm:rounded-xl 
  shadow-md
  sm:shadow-xl 
  z-10 
  transition-all 
  duration-300 
  flex 
  items-center 
  justify-center 
  w-full 
  h-full 
  relative 
  min-h-[350px]
  sm:min-h-[400px] 
  min-w-[280px]
  sm:min-w-[300px] 
  hover:shadow-xl
  sm:hover:shadow-2xl 
  hover:scale-[1.01]
  sm:hover:scale-[1.02] 
  transform-gpu
  overflow-visible
  p-2
  xs:p-3
  sm:p-4
  md:p-6
  lg:p-8
  xl:p-10
`;

// Add animation classes
const bubbleAnimationClass =
  "transition-all duration-300 ease-out hover:scale-105 active:scale-95";
const effectAnimationClass =
  "transition-all duration-500 ease-out hover:rotate-3 hover:scale-110";

// Add Reset Button component
const ResetButton = ({ onReset }: { onReset: () => void }) => (
  <button
    onClick={onReset}
    className="fixed top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 md:top-8 md:right-8 
               bg-red-500 hover:bg-red-600 text-white font-bold 
               text-sm sm:text-base
               py-1 px-2 xs:py-2 xs:px-3 sm:py-2 sm:px-4 md:py-3 md:px-6 
               rounded-md sm:rounded-lg shadow-md sm:shadow-lg 
               z-[1000] transition-all duration-300 transform 
               hover:scale-[1.02] sm:hover:scale-105"
  >
    Reset Components
  </button>
);

// On drag end, update the position state
const handleDragEnd = (event: DragEndEvent) => {
  const { active, delta, activatorEvent } = event;
  let type = active.data.current?.type;
  let id = active.id;
  let parentId = null;
  if (type === "speech-bubble") {
    if (id === "bubble1") parentId = "a";
    if (id === "bubble2") parentId = "b";
    if (id === "bubble3") parentId = "c";
    if (id === "bubble4") parentId = "d";
    if (id === "bubble5") parentId = "f";
    setBubblePositions((prev) => {
      const prevPos = prev[id];
      const prevSize = bubbleSizes[id];
      let newPos = {
        x: prevPos.x + delta.x,
        y: prevPos.y + delta.y,
      };
      // Clamp so the bubble's center is within panel bounds plus margin
      const panelRect = getPanelRect(parentId);
      if (panelRect) {
        const bubbleRect = getBubbleRect(newPos, prevSize);
        // Define safe zone (centered, 40px margin)
        const safeZone = {
          x: panelRect.x + 40,
          y: panelRect.y + 40,
          width: panelRect.width - 80,
          height: panelRect.height - 80,
        };
        const clamped = clampToAvoidSafeZone(panelRect, bubbleRect, safeZone);
        newPos = clamped;
      }
      return {
        ...prev,
        [id]: newPos,
      };
    });
  } else if (type === "effect") {
    parentId = "a"; // Or assign to relevant panel as needed
    setEffectPositions((prev) => {
      const prevPos = prev[id];
      const prevSize = effectSizes[id];
      let pointer = { x: prevPos.x + delta.x, y: prevPos.y + delta.y };
      const panelRect = getPanelRect(parentId);
      let newPos = prevPos;
      if (panelRect) {
        // Define safe zone (centered, 40px margin)
        const safeZone = {
          x: panelRect.x + 40,
          y: panelRect.y + 40,
          width: panelRect.width - 80,
          height: panelRect.height - 80,
        };
        const effectRect = getBubbleRect(pointer, prevSize);
        const clamped = clampToAvoidSafeZone(panelRect, effectRect, safeZone);
        newPos = clamped;
      }
      return {
        ...prev,
        [id]: newPos,
      };
    });
  }
};

const handleReset = () => {
  setBubblePositions(defaultBubblePositions);
  setBubbleSizes(defaultBubbleSizes);
  setEffectPositions(defaultEffectPositions);
  setEffectSizes(defaultEffectSizes);
};

// Add resize handle styles with better visibility
const handleStyles = {
  top: {
    cursor: "ns-resize",
    backgroundColor: showResizeHandles
      ? "rgba(59, 130, 246, 0.5)"
      : "transparent",
  },
  right: {
    cursor: "ew-resize",
    backgroundColor: showResizeHandles
      ? "rgba(59, 130, 246, 0.5)"
      : "transparent",
  },
  bottom: {
    cursor: "ns-resize",
    backgroundColor: showResizeHandles
      ? "rgba(59, 130, 246, 0.5)"
      : "transparent",
  },
  left: {
    cursor: "ew-resize",
    backgroundColor: showResizeHandles
      ? "rgba(59, 130, 246, 0.5)"
      : "transparent",
  },
  topRight: {
    cursor: "ne-resize",
    backgroundColor: showResizeHandles
      ? "rgba(59, 130, 246, 0.5)"
      : "transparent",
  },
  bottomRight: {
    cursor: "se-resize",
    backgroundColor: showResizeHandles
      ? "rgba(59, 130, 246, 0.5)"
      : "transparent",
  },
  bottomLeft: {
    cursor: "sw-resize",
    backgroundColor: showResizeHandles
      ? "rgba(59, 130, 246, 0.5)"
      : "transparent",
  },
  topLeft: {
    cursor: "nw-resize",
    backgroundColor: showResizeHandles
      ? "rgba(59, 130, 246, 0.5)"
      : "transparent",
  },
};

const handleComponent = {
  top: (
    <div
      className={`w-full h-1 rounded-full transition-colors duration-200 ${
        showResizeHandles ? "bg-blue-500" : "bg-transparent"
      }`}
    />
  ),
  right: (
    <div
      className={`w-1 h-full rounded-full transition-colors duration-200 ${
        showResizeHandles ? "bg-blue-500" : "bg-transparent"
      }`}
    />
  ),
  bottom: (
    <div
      className={`w-full h-1 rounded-full transition-colors duration-200 ${
        showResizeHandles ? "bg-blue-500" : "bg-transparent"
      }`}
    />
  ),
  left: (
    <div
      className={`w-1 h-full rounded-full transition-colors duration-200 ${
        showResizeHandles ? "bg-blue-500" : "bg-transparent"
      }`}
    />
  ),
  topRight: (
    <div
      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
        showResizeHandles ? "bg-blue-500" : "bg-transparent"
      }`}
    />
  ),
  bottomRight: (
    <div
      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
        showResizeHandles ? "bg-blue-500" : "bg-transparent"
      }`}
    />
  ),
  bottomLeft: (
    <div
      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
        showResizeHandles ? "bg-blue-500" : "bg-transparent"
      }`}
    />
  ),
  topLeft: (
    <div
      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
        showResizeHandles ? "bg-blue-500" : "bg-transparent"
      }`}
    />
  ),
};

// Add ToggleButton component with better visibility
const ToggleButton = () => (
  <button
    onClick={() => setShowResizeHandles((v) => !v)}
    className={`fixed top-2 left-2 xs:top-3 xs:left-3 sm:top-4 sm:left-4 md:top-8 md:left-8 
               ${
                 showResizeHandles ? "bg-blue-600" : "bg-blue-500"
               } hover:bg-blue-700 text-white font-bold 
               text-sm sm:text-base
               py-1 px-2 xs:py-2 xs:px-3 sm:py-2 sm:px-4 md:py-3 md:px-6 
               rounded-md sm:rounded-lg shadow-md sm:shadow-lg 
               z-[1000] transition-all duration-300 transform 
               hover:scale-[1.02] sm:hover:scale-105`}
  >
    {showResizeHandles ? "Hide Handles" : "Show Handles"}
  </button>
);

// Add useEffect for breakpoint handling
useEffect(() => {
  const getBreakpoint = () => {
    if (window.innerWidth < 640) return "xs";
    if (window.innerWidth < 768) return "sm";
    return "md";
  };
  setBreakpoint(getBreakpoint());
  const handleResize = () => setBreakpoint(getBreakpoint());
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

// Add useEffect to persist resize handle state
useEffect(() => {
  const savedState = localStorage.getItem("showResizeHandles");
  if (savedState !== null) {
    setShowResizeHandles(savedState === "true");
  }
}, []);

// Add useEffect to save resize handle state
useEffect(() => {
  localStorage.setItem("showResizeHandles", showResizeHandles.toString());
}, [showResizeHandles]);

// Update LayoutWrapper to properly handle drag and drop
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragMove={handleDragMove}
    onDragEnd={handleDragEnd}
    modifiers={[restrictToWindowEdges]}
  >
    <div className="relative w-full min-h-screen bg-background">
      <div className="max-w-[2000px] mx-auto px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 lg:px-12 xl:px-16 2xl:px-20">
        <ResetButton onReset={handleReset} />
        <ToggleButton />
        <HalftoneBG />
        {children}
      </div>
    </div>
  </DndContext>
);

// The return statement LAST
return (
  <>
    {variant === "variant1" && (
      <LayoutWrapper>
        <div
          className="relative w-full grid gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 z-10 overflow-visible"
          style={{
            gridTemplateAreas: {
              xs: `
                'a'
                'b'
                'c'
              `,
              sm: `
                'a b'
                'c c'
              `,
              md: `
                'a b'
                'c c'
              `,
            }[breakpoint],
            gridTemplateColumns: {
              xs: "minmax(280px, 1fr)",
              sm: "repeat(2, minmax(280px, 1fr))",
              md: "repeat(2, minmax(280px, 1fr))",
            }[breakpoint],
            gridAutoRows: "minmax(350px, auto)",
            minHeight: "90vh",
          }}
        >
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            animate={activePanel === "c"}
            style="group35"
            showResizeHandles={showResizeHandles}
            handleStyles={handleStyles}
            handleComponent={handleComponent}
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
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            animate={activePanel === "f"}
            style="group29"
            showResizeHandles={showResizeHandles}
            handleStyles={handleStyles}
            handleComponent={handleComponent}
          />
          {/* Panels */}
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "a" }}
            onMouseEnter={() => setActivePanel("a")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "a" ? null : prev))
            }
            onClick={() => setActivePanel("a")}
            ref={panelRefs.a}
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
              fontSize="text-2xl xs:text-3xl sm:text-4xl md:text-5xl"
              parentId="a"
              style="squared"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "b" }}
            onMouseEnter={() => setActivePanel("b")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "b" ? null : prev))
            }
            onClick={() => setActivePanel("b")}
            ref={panelRefs.b}
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
              style="warped"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "c" }}
            onMouseEnter={() => setActivePanel("c")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "c" ? null : prev))
            }
            onClick={() => setActivePanel("c")}
            ref={panelRefs.c}
          />
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "d" }}
            onMouseEnter={() => setActivePanel("d")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "d" ? null : prev))
            }
            onClick={() => setActivePanel("d")}
            ref={panelRefs.d}
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
              style="connector"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "e" }}
            onMouseEnter={() => setActivePanel("e")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "e" ? null : prev))
            }
            onClick={() => setActivePanel("e")}
            ref={panelRefs.e}
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
              style="basic"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "f" }}
            onMouseEnter={() => setActivePanel("f")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "f" ? null : prev))
            }
            onClick={() => setActivePanel("f")}
            ref={panelRefs.f}
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
              style="squared"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
        </div>
      </LayoutWrapper>
    )}
    {variant === "variant2" && (
      <LayoutWrapper>
        <div
          className="relative w-full grid gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 z-10 overflow-visible"
          style={{
            gridTemplateAreas: {
              xs: `
                'a'
                'b'
                'c'
              `,
              sm: `
                'a b'
                'c c'
              `,
              md: `
                'a b'
                'c c'
              `,
            }[breakpoint],
            gridTemplateColumns: {
              xs: "minmax(280px, 1fr)",
              sm: "repeat(2, minmax(280px, 1fr))",
              md: "repeat(2, minmax(280px, 1fr))",
            }[breakpoint],
            gridAutoRows: "minmax(350px, auto)",
            minHeight: "90vh",
          }}
        >
          {/* Panels */}
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "a" }}
            onMouseEnter={() => setActivePanel("a")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "a" ? null : prev))
            }
            onClick={() => setActivePanel("a")}
            ref={panelRefs.a}
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
              fontSize="text-2xl xs:text-3xl sm:text-4xl md:text-5xl"
              parentId="a"
              style="squared"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "b" }}
            onMouseEnter={() => setActivePanel("b")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "b" ? null : prev))
            }
            onClick={() => setActivePanel("b")}
            ref={panelRefs.b}
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
              style="warped"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "c" }}
            onMouseEnter={() => setActivePanel("c")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "c" ? null : prev))
            }
            onClick={() => setActivePanel("c")}
            ref={panelRefs.c}
          >
            <SpeechBubble
              id="bubble3"
              text="Bottom Full Width Panel"
              position={bubblePositions.bubble3}
              setPosition={(pos) =>
                setBubblePositions((prev) => ({ ...prev, bubble3: pos }))
              }
              size={bubbleSizes.bubble3}
              setSize={(size) =>
                setBubbleSizes((prev) => ({ ...prev, bubble3: size }))
              }
              fontSize="text-3xl xs:text-4xl sm:text-5xl md:text-6xl"
              parentId="c"
              style="connector"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
        </div>
      </LayoutWrapper>
    )}
    {variant === "variant3" && (
      <LayoutWrapper>
        <div
          className="relative w-full grid gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 z-10 overflow-visible"
          style={{
            gridTemplateAreas: {
              xs: `
                'a'
                'b'
                'c'
                'd'
              `,
              sm: `
                'a a'
                'b c'
                'd d'
              `,
              md: `
                'a a'
                'b c'
                'd d'
              `,
            }[breakpoint],
            gridTemplateColumns: {
              xs: "minmax(280px, 1fr)",
              sm: "repeat(2, minmax(280px, 1fr))",
              md: "repeat(2, minmax(280px, 1fr))",
            }[breakpoint],
            gridAutoRows: "minmax(350px, auto)",
            minHeight: "90vh",
          }}
        >
          {/* Panels */}
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "a" }}
            onMouseEnter={() => setActivePanel("a")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "a" ? null : prev))
            }
            onClick={() => setActivePanel("a")}
            ref={panelRefs.a}
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
              fontSize="text-2xl xs:text-3xl sm:text-4xl md:text-5xl"
              parentId="a"
              style="squared"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "b" }}
            onMouseEnter={() => setActivePanel("b")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "b" ? null : prev))
            }
            onClick={() => setActivePanel("b")}
            ref={panelRefs.b}
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
              style="warped"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "c" }}
            onMouseEnter={() => setActivePanel("c")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "c" ? null : prev))
            }
            onClick={() => setActivePanel("c")}
            ref={panelRefs.c}
          >
            <SpeechBubble
              id="bubble3"
              text="Middle Right Panel"
              position={bubblePositions.bubble3}
              setPosition={(pos) =>
                setBubblePositions((prev) => ({ ...prev, bubble3: pos }))
              }
              size={bubbleSizes.bubble3}
              setSize={(size) =>
                setBubbleSizes((prev) => ({ ...prev, bubble3: size }))
              }
              fontSize="text-2xl xs:text-3xl sm:text-4xl md:text-5xl"
              parentId="c"
              style="connector"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
          <div
            className={`${panelClass} overflow-visible`}
            style={{ gridArea: "d" }}
            onMouseEnter={() => setActivePanel("d")}
            onMouseLeave={() =>
              setActivePanel((prev) => (prev === "d" ? null : prev))
            }
            onClick={() => setActivePanel("d")}
            ref={panelRefs.d}
          >
            <SpeechBubble
              id="bubble4"
              text="A longer story bubble for more context or even an image!"
              position={bubblePositions.bubble4}
              setPosition={(pos) =>
                setBubblePositions((prev) => ({ ...prev, bubble4: pos }))
              }
              size={bubbleSizes.bubble4}
              setSize={(size) =>
                setBubbleSizes((prev) => ({ ...prev, bubble4: size }))
              }
              fontSize="text-2xl md:text-3xl"
              parentId="d"
              style="connector"
              showResizeHandles={showResizeHandles}
              handleStyles={handleStyles}
              handleComponent={handleComponent}
            />
          </div>
        </div>
      </LayoutWrapper>
    )}
  </>
);
