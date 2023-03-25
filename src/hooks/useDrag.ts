import { createContext, useCallback, useState } from "react";

// Reference: https://qiita.com/ragnar1904/items/0a4338523863922952bb
type UseDrag = {
  drag: boolean;
  setIsDrag: (isDrag: boolean) => void;
};

export const dragContext = createContext<UseDrag>({
  drag: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsDrag: () => {},
});

export const useDrag = (): UseDrag => {
  const [drag, setDrag] = useState(false);
  const setIsDrag = useCallback((state: boolean): void => {
    setDrag(state);
  }, []);

  return {
    drag,
    setIsDrag,
  };
};
