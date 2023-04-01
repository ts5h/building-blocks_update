import React, { useContext, useEffect, useState } from "react";
import tinyColor from "tinycolor2";
import { isMobile } from "react-device-detect";
import { dragContext } from "../../hooks/useDrag";
import Styles from "../../scss/components/Block.module.scss";

// Each block
type Props = BlocksType & {
  idNumber: number;
  color: string;
  current: HTMLDivElement | null;
  setCurrentElement: (arg0: boolean, arg1: HTMLDivElement | null) => void;
};

export const Block = (props: Props) => {
  const {
    id,
    idNumber,
    width,
    height,
    defaultX,
    defaultY,
    defaultZ,
    color,
    current,
    setCurrentElement,
  } = props;

  const { isDrag } = useContext(dragContext);
  const [directStyles, setDirectStyles] = useState({
    zIndex: 0,
    backgroundColor: color,
  });

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
    if (isDrag && current?.id === id) {
      setDirectStyles({
        zIndex: 200,
        backgroundColor: tinyColor(color).lighten(10).toString(),
      });
    } else {
      setDirectStyles({
        zIndex: defaultZ,
        backgroundColor: color,
      });
    }
  }, [color, current, defaultZ, id, idNumber, isDrag]);

  return (
    <div
      id={id}
      role="button"
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDragStart={handleDragStart}
      className={`block ${Styles.block}`}
      style={{
        zIndex: directStyles.zIndex,
        backgroundColor: directStyles.backgroundColor,
        width,
        height,
        left: defaultX,
        top: defaultY,
      }}
    >
      {id}
    </div>
  );
};
