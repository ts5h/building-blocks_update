import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromTouchEvent = (e: TouchEvent) => {
      const touch = e.touches[0];
      setPosition({
        x: touch.pageX,
        y: touch.pageY,
      });
    };

    const setFromMouseEvent = (e: MouseEvent) => {
      setPosition({
        x: e.movementX,
        y: e.movementY,
      });
    };

    if (isMobile) {
      window.addEventListener("touchmove", setFromTouchEvent);
    } else {
      window.addEventListener("mousemove", setFromMouseEvent);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchmove", setFromTouchEvent);
      } else {
        window.removeEventListener("mousemove", setFromMouseEvent);
      }
    };
  }, []);

  return {
    position,
  };
};
