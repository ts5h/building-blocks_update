import React, { FC, useState } from "react";
import { MdOutlineHelpOutline } from "react-icons/md";
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
      </nav>
    </footer>
  );
};
