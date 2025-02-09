import Styles from "./header.module.css";
import logoImage from "../../assets/logos/livsmedelsakademin.png";

function Header() {

  return (
    <div className={Styles.header}>
      <div className={Styles.headerLogo}>
        <img
          className={Styles.logoImage}
          src={logoImage}
          alt="Brand logo image"
        />
      </div>
      <div className={Styles.rightContainer}>
        <div className={Styles.fullName}>
        </div>
        <div className={Styles.logoutContainer}>
          
        </div>
      </div>
    </div>
  );
}

export default Header;
