import { useCallback, useRef, useState } from "react";

export const useSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<AudioContext | null>();
  const sourceRef = useRef<AudioBufferSourceNode | null>();

  const filePath = "http://localhost:3000/sounds/";

  const initAudio = useCallback( (fileName: string) => {
    const context = new AudioContext();
    const source = context.createBufferSource();
    sourceRef.current = source;
    audioRef.current = context;

    // eslint-disable-next-line no-void
    void fetch(`${filePath}${fileName}`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(context.destination);
        source.start(0);
        setIsPlaying(true);
      });
  }, []);

  const startPlaying = useCallback((fileName: string) => {
    if (isPlaying) return;

    if (!audioRef.current) {
      audioRef.current = new AudioContext();
    }
    initAudio(fileName);
  }, [initAudio, isPlaying]);

  // TODO: Need to fix to stop playing properly
  const stopPlaying = useCallback(() => {
    console.log(sourceRef.current);
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }

    if (audioRef.current) {
      // eslint-disable-next-line no-void
      void audioRef.current.close();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return {
    startPlaying,
    stopPlaying,
  };
};
