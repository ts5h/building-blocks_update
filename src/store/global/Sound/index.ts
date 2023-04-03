import { useCallback, useRef, useState } from "react";

export const useSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const filePath = "assets/sounds/";

  const audioContext = useRef(new AudioContext());
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer >();

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
