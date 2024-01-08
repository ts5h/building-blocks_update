import React, { FC, useEffect, useRef, useState } from "react";
import { MdOutlineHelpOutline, MdOutlineClose } from "react-icons/md";
import Styles from "../../scss/components/Footer.module.scss";

export const Footer: FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // const nav = navRef.current;
    // const help = helpRef.current;
  }, [isHelpOpen]);

  const handleClick = () => setIsHelpOpen(!isHelpOpen);

  return (
    <footer className={Styles.footer}>
      <p>&copy; 2023 0bjekt/ts5h, James Cleeland</p>
      <nav className={Styles.nav} ref={navRef}>
        <button
          type="button"
          className={isHelpOpen ? Styles.on : ""}
          onClick={handleClick}
        >
          <p>Help</p>
          <MdOutlineHelpOutline />
        </button>
        <div className={Styles.help} ref={helpRef}>
          <button
            className={Styles.close}
            type="button"
            onClick={handleClick}
          >
            <p>Close</p>
            <MdOutlineClose />
          </button>
          <ul>
            <li>Each shape displayed on the page can be moved by dragging and dropping.</li>
            <li>Each shape plays a sound when dragging.</li>
          </ul>
        </div>
      </nav>
    </footer>
  );
};
