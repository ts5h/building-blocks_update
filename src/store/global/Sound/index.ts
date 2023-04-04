import { useCallback, useState } from "react";

export const useSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);

  const filePath = "/sounds/";

  const initAudio = useCallback(async (fileName: string) => {
    setAudioContext(null);
    setSource(null);

    const ctx = new AudioContext();
    const src = ctx.createBufferSource();

    await fetch(`${filePath}${fileName}`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        src.buffer = audioBuffer;
        src.loop = true;
        src.connect(ctx.destination);
        src.start(0);
      });

    setAudioContext(ctx);
    setSource(src);
    setIsPlaying(true);
  }, []);

  const startPlaying = useCallback(
    (fileName: string) => {
      if (isPlaying) return;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      initAudio(fileName);
    },
    [initAudio, isPlaying],
  );

  const stopPlaying = useCallback(() => {
    source?.stop();
    setSource(null);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    audioContext?.close();
    setAudioContext(null);

    setIsPlaying(false);
  }, [audioContext, source]);

  return {
    startPlaying,
    stopPlaying,
  };
};
