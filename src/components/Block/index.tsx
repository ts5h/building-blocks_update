import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { dragContext } from "../../hooks/useDrag";
import Styles from "../../scss/components/Block.module.scss";

// Each block
type Props = BlocksType & {
  current: HTMLDivElement | null;
  setCurrentElement: (arg0: boolean, arg1: HTMLDivElement | null) => void;
};

export const Block = (props: Props) => {
  const { id, width, height, defaultX, defaultY, current, setCurrentElement } =
    props;

  const { isDrag } = useContext(dragContext);
  const [, idNum] = id.split("_");
  const [directStyles, setDirectStyles] = useState({
    backgroundColor: "#444",
    zIndex: 0,
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
        backgroundColor: "#555",
        zIndex: 200,
      });
    } else {
      setDirectStyles({
        backgroundColor: "#444",
        zIndex: parseInt(idNum, 10),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idNum, current, id]);

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
