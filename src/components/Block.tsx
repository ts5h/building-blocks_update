import React, { useContext, useEffect, useState } from "react";
import isMobile from "ismobilejs";
import { dragContext } from "./DragContext";
import Styles from "../scss/components/Block.module.scss";

// Each block
type BlockProps = {
  id: string;
  width: number;
  height: number;
  defaultX: number;
  defaultY: number;
  current: HTMLDivElement | null;
  setCurrentElement: (arg0: boolean, arg1: HTMLDivElement | null) => void;
};

const Block = (props: BlockProps) => {
  const ctx = useContext(dragContext);
  const { id, width, height, defaultX, defaultY, current, setCurrentElement } =
    props;
  const [, idNum] = id.split("_");
  const [directStyles, setDirectStyles] = useState({
    backgroundColor: "#444",
    zIndex: 0,
  });

  useEffect(() => {
    if (ctx.drag && current?.id === id) {
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

  const onMouseDownHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (!isMobile().any) {
      setCurrentElement(true, e.currentTarget);
    }
  };

  const onTouchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile().any) {
      setCurrentElement(true, e.currentTarget);
    }
  };

  return (
    <div
      id={id}
      role="button"
      tabIndex={-1}
      onMouseDown={(e) => onMouseDownHandler(e)}
      onTouchStart={(e) => onTouchStartHandler(e)}
      onDragStart={(e) => e.preventDefault()}
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

export default Block;
