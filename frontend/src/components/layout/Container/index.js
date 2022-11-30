import styles from "./Container.module.css";

const Container = ({ children }) => {
  return(
    <main className={styles.main}>
      { children }
    </main>
  );
};

export default Container;