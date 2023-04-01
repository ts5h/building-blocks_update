import React, { useContext, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { dragContext } from "../../hooks/useDrag";
import { blocksData } from "../../data/blocksData";
import Styles from "../../scss/components/Block.module.scss";

// Each block
type Props = BlocksType & {
  maxZ: React.MutableRefObject<number>;
  color: string;
  current: HTMLDivElement | null;
  setCurrentElement: (arg0: boolean, arg1: HTMLDivElement | null) => void;
};

export const Block = (props: Props) => {
  const {
    maxZ,
    id,
    width,
    height,
    defaultX,
    defaultY,
    color,
    current,
    setCurrentElement,

  } = props;

  const { isDrag } = useContext(dragContext);
  const [directStyles, setDirectStyles] = useState({
    zIndex: 0,
    backgroundColor: color,
  });

  const [, idNum] = useMemo(() => id.split("_"), [id]);

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

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    e.currentTarget.blur();
  };

  useEffect(() => {
    if (isDrag && current?.id === id) {
      const zIndex = maxZ.current + 1;
      setDirectStyles({
        zIndex,
        backgroundColor: "#555",
      });
    } else {
      const el = document.getElementById(id);
      if (!el) return;

      let zIndex = parseInt(getComputedStyle(el).zIndex, 10);
      if (zIndex === 0) {
        zIndex = blocksData[parseInt(idNum, 10)].defaultZ;
      }

      setDirectStyles({
        zIndex,
        backgroundColor: color,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, idNum, id]);

  return (
    <div
      id={id}
      role="button"
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDragStart={handleDragStart}
      onFocus={handleFocus}
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
