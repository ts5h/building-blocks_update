import React, {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import firebase from "firebase/compat/app";
import db from "../../configs/FirebaseConfig";
import { dragContext } from "../../hooks/useDrag";
import UseMousePosition from "../../hooks/UseMousePosition";
import { blocksData } from "../../data/blocksData";
import { Block } from "../Block";
import Styles from "../../scss/components/Playground.module.scss";

// Blocks data types in DB
type BlocksLog = {
  blocks: [
    {
      id: string;
      x: number;
      y: number;
    },
  ];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
};

// Playground
type Props = {
  AppRef: RefObject<HTMLDivElement | null>;
};

export const Playground = (props: Props) => {
  const { AppRef } = props;
  const App = AppRef.current;

  const dbRef = db.collection("blocks_2023").doc("position");
  const { isDrag, setIsDrag } = useContext(dragContext);
  const movement = UseMousePosition();

  const [blocks, setBlocks] = useState(blocksData);
  const [current, setCurrent] = useState<HTMLDivElement | null>(null);

  // Get blocks coordination on load and updated
  useEffect(() => {
    const unsubscribe = dbRef.onSnapshot((snapshot) => {
      const loadedBlocks = (snapshot.data() as BlocksLog).blocks;
      const updateBlocks = loadedBlocks.map((block) => {
        const [, idNumStr] = block.id.split("_");
        const idNum = parseInt(idNumStr, 10);

        return {
          id: block.id,
          color: "",
          defaultX: block.x < 0 ? 0 : block.x,
          defaultY: block.y < 0 ? 0 : block.y,
          width: blocksData[idNum].width,
          height: blocksData[idNum].height,
        };
      });

      setBlocks(updateBlocks);
      // console.log(updateBlocks);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set current element via parent function
  const setCurrentElement = (state: boolean, div: HTMLDivElement | null) => {
    setIsDrag(state);
    setCurrent(div);
  };

  // Mouse up
  const updatePosition = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!App || e.target !== current || !current) return;

      const updatedBlocks = [];
      for (let i = 0; i < blocks.length; i += 1) {
        const el = document.querySelector(`#${blocks[i].id}`);
        let x: number;
        let y: number;

        if (el) {
          const pos = el.getBoundingClientRect();
          if (isMobile) {
            x = pos.x + App.scrollLeft;
            y = pos.y + App.scrollTop;
          } else {
            x = pos.x + window.scrollX;
            y = pos.y + window.scrollY;
          }
        } else {
          x = blocks[i].defaultX;
          y = blocks[i].defaultY;
        }

        updatedBlocks.push({ id: blocks[i].id, x, y });
      }

      // Prevent slipping a few px of the block while dragging when on mouseup.
      // Ignore the return value without using async/await because the process is rather heavy.
      // eslint-disable-next-line no-void
      void dbRef.update({
        blocks: updatedBlocks,
        updatedAt: firebase.firestore.Timestamp.now(),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [App, blocks, current],
  );

  useEffect(() => {
    const onMouseUpHandler = (e: MouseEvent | TouchEvent) => {
      try {
        updatePosition(e);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDrag(false);
        setCurrent(null);
      }
    };

    if (isMobile) {
      window.addEventListener("touchend", onMouseUpHandler);
    } else {
      window.addEventListener("mouseup", onMouseUpHandler);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchend", onMouseUpHandler);
      } else {
        window.removeEventListener("mouseup", onMouseUpHandler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePosition]);

  // Mouse move
  useEffect(() => {
    const onMoveHandler = (e: MouseEvent | TouchEvent) => {
      if (!App || !isDrag || !current) return;

      const blockPosition = current.getBoundingClientRect();
      let left;
      let top;

      if (isMobile) {
        left = movement.x - blockPosition.width / 2 + App.scrollLeft;
        top = movement.y - blockPosition.height / 2 + App.scrollTop;
      } else {
        left = movement.x + blockPosition.x + window.scrollX;
        top = movement.y + blockPosition.y + window.scrollY;
      }

      if (left < 0) {
        left = 0;
      } else if (left > 2000 - blockPosition.width) {
        left = 2000 - blockPosition.width;
      }

      if (top < 0) {
        top = 0;
      } else if (top > 2000 - blockPosition.height) {
        top = 2000 - blockPosition.height;
      }

      current.style.left = `${left}px`;
      current.style.top = `${top}px`;

      if (isMobile && e.target === current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isMobile) {
      window.addEventListener("touchmove", onMoveHandler, { passive: false });
    } else {
      window.addEventListener("mousemove", onMoveHandler);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchmove", onMoveHandler);
      } else {
        window.removeEventListener("mousemove", onMoveHandler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [App, movement]);

  return (
    <div id="playground" className={Styles.playground}>
      {Object.entries(blocks).map(([key, value]) => (
        <Block
          key={key}
          id={value.id}
          color={value.color}
          width={value.width}
          height={value.height}
          defaultX={value.defaultX}
          defaultY={value.defaultY}
          current={current}
          setCurrentElement={setCurrentElement}
        />
      ))}
    </div>
  );
};
