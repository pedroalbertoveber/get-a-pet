/* external modules */
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

/* api */
import api from "utils/api";

/* styles */
import styles from "./PetDetails.module.css";

const PetDetails = () => {

  const [ pet, setPet ] = useState({});
  const [ token ] = useState(localStorage.getItem("token"), "");
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSchedule = async () => {
    await api.patch(`/pets/schedule/${pet._id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }).then((response) => {
      toast.success(response.data.message);
      navigate("/");
    }).catch((err) => {
      toast.error(err.response.data.message);
    })
  };

  useEffect(() => {
    api.get(`/pets/${id}`)
    .then((response) => {
      setPet(response.data.pet);
    }).catch((err) => {
      toast.error(err.response.data.message);
      navigate("/");
    })
  }, [id, navigate])

  return(
    <>
      {pet.name &&
        <section className={styles.petdetails_container}>
          <div className={styles.petdetails_header}>
            <h1>Detalhes do Pet: {pet.name}</h1>
            <p>Se tiver interesse, marque uma visita para conhecê-lo</p>
          </div>
          <div className={styles.pet_images}>
            {pet.images.map((image, index) => (
              <img src={`http://localhost:5000/images/pets/${image}`} alt={pet.name} key={`${pet.name}+${index}`} />
            ))}
          </div>
          <p>
            <span className="bold">Idade: </span>{pet.age} anos
          </p>
          <p>
            <span className="bold">Peso: </span>{pet.weight}kg
          </p>
          {token ? (
            <button onClick={() => handleSchedule(pet)}>
              Solicitar uma visita
            </button>
          ) : (
            <p>Você precisa <Link to={"/register"}>criar uma conta</Link> para solicitar a visita</p>
          )}
        </section>
      }
    </>
  );
};

export default PetDetails;