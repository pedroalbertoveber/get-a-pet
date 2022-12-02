/* api */
import api from "utils/api";

/* external modules */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

/* styles */
import styles from "./Home.module.css";

const Home = () => {

  const [ pets, setPets ] = useState([]);

  useEffect(() => {
    api.get("/pets").then((response) => {
      setPets(response.data.pets);
    }).catch((err) => {
      toast.error(err.response.data.message);
    });
  }, []);

  return (
    <section>
      <div className={styles.pet_home_header}>
        <h1>Adote um Pet</h1>
        <p>Veja os datelhes de cada um e conheça o tutor deles</p>
      </div>
      <div className={styles.pet_container}>
        {pets.length > 0 && (
          pets.map((pet) => (
            <div key={pet._id} className={styles.pet_card}>
              <div className={styles.pet_card_image} style={{backgroundImage: `url(http://localhost:5000/images/pets/${pet.images[0]})`}}></div>
              <h3>{pet.name}</h3>
              <p>
                <span className="bold">Peso:</span> {pet.weight}kg
              </p>
              {pet.available ? <Link to={`/pet/${pet._id}`}>Mais Detalhes</Link> : 
              <p className={styles.adopter_text}>Adotado</p>}
            </div>
          ))
        )}
        {pets.length === 0 && <p>Não há pets cadastrados ou disponíveis no momento</p>}
      </div>
    </section>
  );
};

export default Home;