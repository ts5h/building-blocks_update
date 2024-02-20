import { useCallback, useState } from "react";
import { isChrome, isMobile } from "react-device-detect";
import { useAtom } from "jotai";
import { audioContextAtom } from "../../store/global/atoms";

export const useFirstTouch = () => {
  const [audioContext] = useAtom<AudioContext>(audioContextAtom);
  const [isFirstTouch, setFirstTouch] = useState(true);

  const handleFirstTouch = useCallback(async () => {
    if (!isMobile || !isFirstTouch) return;

    const source = audioContext.createBufferSource();
    source.buffer = audioContext.createBuffer(1, 1, 22050);
    source.onended = () => source.disconnect();

    source.connect(audioContext.destination);
    source.start(0);
    source.stop(0.01);

    if (isChrome) {
      await new AudioContext().resume().catch((error) => console.log(error));
    }

    setFirstTouch(false);
  }, [audioContext, isFirstTouch]);

  return { handleFirstTouch };
};
