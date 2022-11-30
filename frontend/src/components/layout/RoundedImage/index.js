/* styles */
import styles from "./RoundedImage.module.css";

const RoundedImage = ({ imgPath, alt, width }) => {
  return(
    <img src={imgPath} alt={alt} className={`${styles.image_container} ${styles[width]}`}/>
  );
};

export default RoundedImage;