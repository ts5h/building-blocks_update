import { createContext, useCallback, useState } from "react";

// Reference: https://qiita.com/ragnar1904/items/0a4338523863922952bb
type UseDrag = {
  isDrag: boolean;
  setIsDrag: (isDrag: boolean) => void;
};

export const dragContext = createContext<UseDrag>({
  isDrag: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsDrag: () => {},
});

export const useDrag = (): UseDrag => {
  const [isDrag, setDrag] = useState(false);
  const setIsDrag = useCallback((state: boolean): void => {
    setDrag(state);
  }, []);

  return {
    isDrag,
    setIsDrag,
  };
};
