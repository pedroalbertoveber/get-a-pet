/* external modules */
import { useState, useEffect } from "react"
import { toast } from "react-toastify";

/* components */
import RoundedImage from "components/layout/RoundedImage";

/* api */
import api from "utils/api";

/* styles */
import styles from "../Dashbord.module.css"

const MyAdoptions = () => {

  const [ pets, setPets ] = useState([]);
  const [ token ] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    api.get("/pets/myadoptions", {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }).then((response) => {
      setPets(response.data.pets);
    }).catch((err) => {
      toast.error(err.response.data.message);
    })
  }, [ token ])

  return (
    <>
  {pets.length > 0 ? 
    <section>
      <div className={styles.petlist_header}>
        <h1>Minhas adoções</h1>
      </div>
      <div className={styles.petlist_container}>
        {pets.map((pet) => (
          <div key={pet._id} className={styles.petlist_row}>
            <RoundedImage imgPath={`http://localhost:5000/images/pets/${pet.images[0]}`} alt={pet.name} width="px100"/>
            <span className="bold">{pet.name}</span>
            <div>
              <p>
                <span className="bold">Ligue para:</span> {pet.user.phone}
              </p>
              <p>
                <span className="bold">Fale com:</span> {pet.user.name}
              </p>
            </div>
            <div className={styles.action}>
              {pet.available ? (
                <p>Adoção em processo...</p>
              ) : (
                <p>Parabéns por concluir a adoção!!</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
    :
    <p>Você ainda não tem pets</p>
  }
  </>
  )
};

export default MyAdoptions;