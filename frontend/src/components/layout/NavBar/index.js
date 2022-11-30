/* external modules */
import { Link } from "react-router-dom";
import { useContext } from "react";

/* context */
import { Context } from "context/UserContext";

/* assests */
import Logo from "assets/img/logo.png";

/* styles */
import styles from "./NavBar.module.css";

const NavBar = () => {

  const { authenticated, logout } = useContext(Context);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt={"Get a Pet"}/>
        <h2>Get a Pet</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        {authenticated ?
        <>
          <li>
            <Link to="/user/profile">Perfil</Link>
          </li>
          <li onClick={logout}>
            LogOut
          </li>
        </>
        :
        <>
          <li>
            <Link to="/login">Entrar</Link>
          </li>
          <li>
            <Link to="/register">Registrar</Link>
          </li>
        </>
        }
      </ul>
    </nav>
  );
};

export default NavBar;