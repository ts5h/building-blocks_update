import { useCallback } from "react";

export const useSound = () => {
  // TODO: Play and stop sound logic
  const playLoopSound = useCallback((fileName: string) => {
    console.log("play sound");
  }, []);

  const stopLoopSound = useCallback(() => {
    console.log("stop sound");
  }, []);

  return {
    playLoopSound,
    stopLoopSound,
  };
};
