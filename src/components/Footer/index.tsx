import React, { FC, useState } from "react";
import { MdOutlineHelpOutline, MdOutlineClose } from "react-icons/md";
import Styles from "../../scss/components/Footer.module.scss";

export const Footer: FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleClick = () => setIsHelpOpen(!isHelpOpen);

  return (
    <footer className={Styles.footer}>
      <p>&copy; 2023 0bjekt/ts5h, James Cleeland</p>
      <nav className={Styles.nav}>
        <button
          type="button"
          className={isHelpOpen ? Styles.on : ""}
          onClick={handleClick}
        >
          <p>Help</p>
          <MdOutlineHelpOutline />
        </button>
        <div className={`${Styles.help} ${isHelpOpen ? Styles.show : ""}`}>
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
