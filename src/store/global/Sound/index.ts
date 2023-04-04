import { useCallback, useRef, useState } from "react";

export const useSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>();
  const [source, setSource] = useState<AudioBufferSourceNode | null>();

  const filePath = "/sounds/";

  const initAudio = useCallback((fileName: string) => {
    const ctx = new AudioContext();
    const src = ctx.createBufferSource();

    // eslint-disable-next-line no-void
    void fetch(`${filePath}${fileName}`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        src.buffer = audioBuffer;
        src.loop = true;
        src.connect(ctx.destination);
        src.start(0);

        setAudioContext(ctx);
        setSource(src);
        setIsPlaying(true);
      });
  }, []);

  const startPlaying = useCallback(
    (fileName: string) => {
      if (isPlaying) return;
      initAudio(fileName);
    },
    [initAudio, isPlaying],
  );

  // TODO: Need to fix to stop playing properly
  const stopPlaying = useCallback(() => {
    console.log(source);
    source?.stop();
    setSource(null);

    // eslint-disable-next-line no-void
    void audioContext?.close();
    setAudioContext(null);

    setIsPlaying(false);
  }, [audioContext, source]);

  return {
    startPlaying,
    stopPlaying,
  };
};
