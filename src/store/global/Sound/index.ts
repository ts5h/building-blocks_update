import { useCallback, useEffect, useState } from "react";

export const useSound = () => {
  const [isLoop, setIsLoop] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);

  const filePath = "https://0bjekt.co/2023/building-blocks_2/sounds";
  // const filePath = "/sounds";

  const initAudio = useCallback(
    async (fileName: string) => {
      // Check the file condition
      if (fileName === "") {
        console.error("File name is empty");
        return;
      }

      const extension = fileName.split(".").pop() || "";
      if (extension !== "mp3") {
        console.error(`File extension ${extension} is not supported`);
        return;
      }

      if (source) {
        source.stop();
        source.disconnect();
        setSource(null);
      }

      if (audioContext) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        audioContext.close();
        setAudioContext(null);
      }

      const ctx = new AudioContext();
      const src = ctx.createBufferSource();

      await fetch(`${filePath}/${fileName}`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          src.buffer = audioBuffer;
          src.loop = true;
          src.connect(ctx.destination);
          src.start(0);

          setAudioContext(ctx);
          setSource(src);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error(`Failed to load file: ${filePath}${fileName}`, error);
        });
    },
    [audioContext, source],
  );

  const startPlaying = useCallback(
    (soundFile: Sound) => {
      console.log(soundFile);
      const { fileName, loop } = soundFile;
      setIsLoop(loop);

      if (!isLoaded || loop) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        initAudio(fileName).catch((error) => console.error(error));
      } else {
        audioContext?.resume().catch((error) => console.error(error));
      }

      setIsPlaying(true);
    },
    [audioContext, initAudio, isLoaded],
  );

  // NOTE: Suspend audio context correctly when isPlaying is false
  useEffect(() => {
    if (!isPlaying && !isLoop) {
      audioContext?.suspend().catch((error) => console.error(error));
    }
  }, [audioContext, isLoop, isPlaying]);

  const stopPlaying = useCallback(() => {
    if (isLoop) {
      source?.stop();
      source?.disconnect();
      setSource(null);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      audioContext?.close();
      setAudioContext(null);
    }

    setIsPlaying(false);
  }, [audioContext, isLoop, source]);

  return {
    startPlaying,
    stopPlaying,
  };
};
