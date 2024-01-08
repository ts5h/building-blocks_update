import React, { FC } from "react";
import { MdOutlineHelpOutline } from "react-icons/md";
import Styles from "../../scss/components/Footer.module.scss";

export const Footer: FC = () => {
  return (
    <footer className={Styles.footer}>
      <p>&copy; 2023 0bjekt/ts5h, James Cleeland</p>
      <nav>
        <MdOutlineHelpOutline className={Styles.button} onClick={() => {}} />
      </nav>
    </footer>
  );
};
