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
import { colors } from "../../constants/colors";
import { blocksData } from "../../data/blocksData";
import { dragContext } from "../../store/global/Drag";
import { useMousePosition } from "../../store/global/MousePosition";
import { Block } from "../Block";
import Styles from "../../scss/components/Playground.module.scss";

// Blocks data types in DB
type Blocks = {
  id: number;
  x: number;
  y: number;
  z: number;
};

type BlocksLog = {
  blocks: Blocks[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
};

type Props = {
  AppRef: RefObject<HTMLDivElement | null>;
};

export const Playground = (props: Props) => {
  const { AppRef } = props;
  const dbRef = db.collection("blocks_2023").doc("position");
  const { isDrag, setIsDrag } = useContext(dragContext);
  const { position } = useMousePosition();

  const [blocks, setBlocks] = useState(blocksData);
  const [current, setCurrent] = useState<HTMLDivElement | null>(null);
  const [topZ, setTopZ] = useState(blocks.length);

  const windowLimit = 2000;

  const getMyColor = useCallback((id: number) => {
    return colors[id % colors.length];
  }, []);

  // Get blocks coordination on load and updated
  useEffect(() => {
    const unsubscribe = dbRef.onSnapshot((snapshot) => {
      const loadedBlocks = (snapshot.data() as BlocksLog).blocks;
      if (!loadedBlocks) return;

      const updateBlocks: BlocksType[] = loadedBlocks.map((block) => {
        return {
          id: block.id,
          defaultX: block.x,
          defaultY: block.y,
          defaultZ: block.z,
          width: blocksData[block.id].width,
          height: blocksData[block.id].height,
        };
      });

      setBlocks(updateBlocks);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topZ]);

  // Set current element via parent function
  const setCurrentElement = useCallback(
    (state: boolean, divElement: HTMLDivElement | null) => {
      setIsDrag(state);
      setCurrent(divElement);
    },
    [setIsDrag],
  );

  // Update DB on mouse up
  const updatePosition = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!AppRef.current || e.target !== current || !current) return;
      const App = AppRef.current;

      let updatedBlocks: Blocks[] = [];
      for (let i = 0; i < blocks.length; i += 1) {
        const el = document.getElementById(`block_${blocks[i].id}`);
        let x: number;
        let y: number;
        const z =
          (el &&
            parseInt(getComputedStyle(el).getPropertyValue("z-index"), 10)) ||
          0;

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

        updatedBlocks.push({ id: blocks[i].id, x, y, z });
      }

      // Sort and re-numbering z-index
      updatedBlocks.sort((a, b) => {
        return a.z < b.z ? -1 : 1;
      });

      updatedBlocks = updatedBlocks.map((block, index) => {
        return { ...block, z: index };
      });

      updatedBlocks.sort((a, b) => {
        return a.id < b.id ? -1 : 1;
      });

      // Prevent slipping a few px of the block while dragging when on mouseup.
      // Ignore the return value without using async/await because the process is rather heavy.

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      dbRef.update({
        blocks: updatedBlocks,
        updatedAt: firebase.firestore.Timestamp.now(),
      });
    },
    [AppRef, blocks, current, dbRef],
  );

  // Mouse up
  useEffect(() => {
    const onMouseUpHandler = (e: MouseEvent | TouchEvent) => {
      if (current) {
        // To reduce screen flickering, not change the whole blocks, except for elements related to pointer actions.
        setTopZ((prev) => prev + 1);
        setCurrent(null);
      }
      setIsDrag(false);

      try {
        updatePosition(e);
      } catch (err) {
        console.error(err);
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
  }, [current, setIsDrag, updatePosition]);

  // Mouse move
  useEffect(() => {
    const onMoveHandler = (e: MouseEvent | TouchEvent) => {
      if (!AppRef.current || !isDrag || !current) return;
      const App = AppRef.current;

      const blockPosition = current.getBoundingClientRect();
      let left;
      let top;

      if (isMobile) {
        left = position.x - blockPosition.width / 2 + App.scrollLeft;
        top = position.y - blockPosition.height / 2 + App.scrollTop;
      } else {
        left = position.x + blockPosition.x + window.scrollX;
        top = position.y + blockPosition.y + window.scrollY;
      }

      if (left < 0) {
        left = 0;
      } else if (left > windowLimit - blockPosition.width) {
        left = windowLimit - blockPosition.width;
      }

      if (top < 0) {
        top = 0;
      } else if (top > windowLimit - blockPosition.height) {
        top = windowLimit - blockPosition.height;
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
  }, [position, isDrag, current, AppRef]);

  return (
    <div id="playground" className={Styles.playground}>
      {Object.entries(blocks).map(([key, value]) => (
        <Block
          key={key}
          id={value.id}
          width={value.width}
          height={value.height}
          x={value.defaultX}
          y={value.defaultY}
          z={value.defaultZ}
          color={getMyColor(value.id)}
          topZ={topZ}
          current={current}
          setCurrentElement={setCurrentElement}
        />
      ))}
    </div>
  );
};
