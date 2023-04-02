import React, { useContext, useEffect, useState } from "react";
import tinyColor from "tinycolor2";
import { isMobile } from "react-device-detect";
import { dragContext } from "../../hooks/useDrag";
import Styles from "../../scss/components/Block.module.scss";

// Each block
type Props = Pick<BlocksType, "id" | "width" | "height"> & {
  x: number;
  y: number;
  z: number;
  color: string;
  current: HTMLDivElement | null;
  setCurrentElement: (arg0: boolean, arg1: HTMLDivElement | null) => void;
};

export const Block = (props: Props) => {
  const { id, width, height, x, y, z, color, current, setCurrentElement } =
    props;

  const { isDrag } = useContext(dragContext);
  const [bgColor, setBgColor] = useState(color);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isMobile) {
      setCurrentElement(true, e.currentTarget);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile) {
      setCurrentElement(true, e.currentTarget);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    // TODO: Play and stop sound
    if (isDrag && current?.id === id) {
      setBgColor(tinyColor(color).lighten(10).toString());
    } else {
      setBgColor(color);
    }
  }, [color, current?.id, id, isDrag]);

  return (
    <div
      role="button"
      id={id}
      className={`block ${Styles.block}`}
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDragStart={handleDragStart}
      style={{
        width,
        height,
        left: x,
        top: y,
        zIndex: z,
        backgroundColor: bgColor,
      }}
    >
      {id}
    </div>
  );
};
