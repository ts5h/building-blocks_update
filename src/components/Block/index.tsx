import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import tinyColor from "tinycolor2";
import { sounds } from "../../constants/sounds";
import { dragContext } from "../../store/global/Drag";
import { useSound } from "../../store/global/Sound";
import Styles from "../../scss/components/Block.module.scss";

type Props = Pick<BlocksType, "id" | "width" | "height"> & {
  x: number;
  y: number;
  z: number;
  color: string;
  topZ: number;
  current: HTMLDivElement | null;
  setCurrentElement: (
    state: boolean,
    divElement: HTMLDivElement | null,
  ) => void;
};

export const Block = (props: Props) => {
  const {
    id,
    width,
    height,
    x,
    y,
    z,
    color,
    topZ,
    current,
    setCurrentElement,
  } = props;

  const { isDrag } = useContext(dragContext);
  const [bgColor, setBgColor] = useState(color);
  const [zIndex, setZIndex] = useState(z);

  const { startPlaying, stopPlaying } = useSound();
  const soundFile = sounds[id % sounds.length];

  // Set again z-index when reload etc.
  useEffect(() => {
    setZIndex(z);
  }, [z]);

  // Set hover
  useEffect(() => {
    const blockId = `block_${id}`;
    if (isDrag && current?.id === blockId) {
      setBgColor(tinyColor(color).setAlpha(0.75).toRgbString());
      setZIndex(topZ);
    } else {
      setBgColor(color);
      // Hold current z-index
    }
  }, [color, current?.id, id, isDrag, startPlaying, topZ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) return;

    setCurrentElement(true, e.currentTarget);
    startPlaying(soundFile);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    setCurrentElement(true, e.currentTarget);
    startPlaying(soundFile);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    stopPlaying();
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    stopPlaying();
  };

  return (
    <div
      role="button"
      id={`block_${id}`}
      className={`block ${Styles.block}`}
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDragStart={handleDragStart}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      style={{
        width,
        height,
        left: x,
        top: y,
        zIndex,
        backgroundColor: bgColor,
      }}
    >
      {id}
    </div>
  );
};
