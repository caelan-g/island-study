"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

export default function DraggableImageCard() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [lastTimestamp, setLastTimestamp] = useState(0);

  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const currentTime = Date.now();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Update position
      setPosition({ x: newX, y: newY });

      // Calculate velocity (pixels per millisecond)
      if (currentTime - lastTimestamp > 0) {
        const dx = newX - lastPosition.x;
        const dy = newY - lastPosition.y;
        const timeDelta = currentTime - lastTimestamp;

        setVelocity({
          x: (dx / timeDelta) * 16, // Scale to roughly pixels per frame at 60fps
          y: (dy / timeDelta) * 16,
        });

        setLastPosition({ x: newX, y: newY });
        setLastTimestamp(currentTime);
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging, dragStart, lastPosition, lastTimestamp]
  );

  const handleMouseDown = useCallback(
    (e) => {
      // Stop any ongoing momentum animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });

      setLastPosition(position);
      setLastTimestamp(Date.now());
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    },
    [position]
  );

  // Apply momentum when mouse is released
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    // Start momentum animation if we have velocity
    if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
      let currentVelocity = { ...velocity };
      const decayFactor = 0.95; // Controls how quickly the momentum slows down

      const applyMomentum = () => {
        setPosition((prevPos) => ({
          x: prevPos.x + currentVelocity.x,
          y: prevPos.y + currentVelocity.y,
        }));

        // Apply decay to slow down
        currentVelocity = {
          x: currentVelocity.x * decayFactor,
          y: currentVelocity.y * decayFactor,
        };

        // Continue animation until velocity becomes very small
        if (
          Math.abs(currentVelocity.x) > 0.1 ||
          Math.abs(currentVelocity.y) > 0.1
        ) {
          animationRef.current = requestAnimationFrame(applyMomentum);
        } else {
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(applyMomentum);
    }
  }, [velocity]);

  // Handle wheel event for zooming
  const handleWheel = (e) => {
    e.preventDefault();

    // Stop any ongoing momentum animation when zooming
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const delta = e.deltaY * -0.01;
    const newZoom = Math.max(1, Math.min(5, zoom + delta));
    setZoom(newZoom);
  };

  // Reset to initial state
  const handleReset = () => {
    // Stop any ongoing momentum animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setPosition({ x: 0, y: 0 });
    setZoom(1);
    setVelocity({ x: 0, y: 0 });
  };

  // Handle zoom button clicks
  const handleZoomIn = () => {
    const newZoom = Math.min(5, zoom + 0.5);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(1, zoom - 0.5);
    setZoom(newZoom);
  };

  // Clean up animations when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, handleMouseUp]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <Card className="w-full overflow-hidden">
        <CardContent
          className="p-0 relative h-80 overflow-hidden cursor-move"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            ref={imageRef}
            className="absolute"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: "top left",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src="/images/light_island.png"
              alt="Draggable image"
              className="w-full h-full object-contain"
              draggable="false"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 5}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Zoom: {Math.round(zoom * 100)}% • Drag to move • Scroll to zoom
      </div>
    </div>
  );
}
