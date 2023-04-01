import React, { useRef } from "react";
import { isMobile } from "react-device-detect";
import { dragContext, useDrag } from "./hooks/useDrag";
import { Playground } from "./components/Playground";
import "./scss/App.scss";

const App = () => {
  const ctx = useDrag();
  const AppRef = useRef(null);

  return (
    <dragContext.Provider value={ctx}>
      <div ref={AppRef} className={`App ${isMobile && ctx.drag ? "lock" : ""}`}>
        <Playground AppRef={AppRef} />
      </div>
    </dragContext.Provider>
  );
};

export default App;
