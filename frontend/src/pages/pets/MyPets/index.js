/* external modules */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

/* styles */
import styles from "../Dashbord.module.css";

/* components */
import RoundedImage from "components/layout/RoundedImage";

/* api */
import api from "utils/api";

const MyPets = () => {

  const [ pets, setPets ] = useState([]);
  const [ token ] = useState(localStorage.getItem("token" || ""));

  useEffect(() => {
    api.get("/pets/mypets", {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      }
    })
    .then((response) => {
      setPets(response.data.pets);
    })
    .catch((err) => {
      toast.error(err.response.data.message);
    })
  }, [ token ]);

  const removePet = async (id) => {
    await api.delete(`/pets/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
    .then((response) => {
      toast.success(response.data.message);
      const updatedPets = pets.filter(pet => pet._id !== id);
      setPets(updatedPets);

      return response.data;
    })
    .catch((err) => {
      toast.error(err.reponse.data.message);
    })
  };

  const concludeAdoption = async (id) => {
    await api.patch(`/pets/conclude/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }).then((response) => {
      toast.success(response.data.message);
    }).catch((err) => {
      toast.error(err.response.data.message);
    });
  };

  return (
    <section>
      <div className={styles.petlist_header}>
      <h1>MyPets</h1>
      <Link to={"/pet/add"}>Cadastrar Pet</Link>
      </div>
      <div className={styles.petlist_container}>
        {pets.length > 0 &&
          pets.map((pet) => (
            <div key={pet._id} className={styles.petlist_row}>
              <RoundedImage 
                imgPath={`http://localhost:5000/images/pets/${pet.images[0]}`}
                alt={pet.name}
                width="px100"
              />
              <span className="bold">{pet.name}</span>
              <div className={styles.action}>
                {pet.available ? 
                (
                  <>
                    {pet.adopter && (
                      <button className={styles.conclude_btn} onClick={() => concludeAdoption(pet._id)}>
                        Concluir adoção
                      </button>
                    )}
                    <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                    <button onClick={() => removePet(pet._id)}>Excluir</button>
                  </>
                ) : 
                (
                  <p>Pet já adotado</p>
                )}
              </div>
            </div>
          ))
        }
        {pets.length === 0 && <p>Não há Pets cadastrados</p>}
      </div>
    </section>
  );
};

export default MyPets;