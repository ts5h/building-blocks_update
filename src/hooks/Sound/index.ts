import { useCallback, useState } from "react";

const filePath = "https://0bjekt.co/2023/building-blocks_2/sounds";
// const filePath = "/sounds";

export const useSound = () => {
  const [isLoop, setIsLoop] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const initAudio = useCallback((fileName: string) => {
    const localAudio = new Audio(`${filePath}/${fileName}`);
    localAudio.loop = true;
    localAudio.autoplay = true;

    setAudio(localAudio);
    setIsLoaded(true);
  }, []);

  const startPlaying = useCallback(
    (soundFile: Sound) => {
      const { fileName, loop } = soundFile;
      setIsLoop(loop);

      if (!isLoaded) initAudio(fileName);
      if (!audio || isPlaying) return;

      if (loop) {
        audio.currentTime = 0;
      } else {
        audio.currentTime = currentTime;
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      audio.play();
      setIsPlaying(true);
    },
    [audio, currentTime, initAudio, isLoaded, isPlaying],
  );

  const stopPlaying = useCallback(() => {
    if (!audio || !isLoaded) return;

    if (!isLoop) {
      setCurrentTime(audio.currentTime);
    }

    audio.pause();
    setIsPlaying(false);
  }, [audio, isLoaded, isLoop]);

  return {
    startPlaying,
    stopPlaying,
  };
};
