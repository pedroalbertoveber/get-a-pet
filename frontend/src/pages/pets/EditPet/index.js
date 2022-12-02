/* external modules */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* api */
import api from "utils/api";

/* components */
import PetForm from "components/form/PetForm";

/* styles */
import styles from "pages/pets/AddPet/AddPet.module.css";

const EditPet = () => {

  const { id } = useParams();
  const [ pet, setPet ] = useState({});
  const [ token ] = useState(localStorage.getItem("token" || ""));
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/pets/${id}`, {
      headers : {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    })
    .then((response) => {
      setPet(response.data.pet);
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      return err.response.data;
    })
  }, [ token, id ]);

  const updatePet = async (pet) => {
    const formData = new FormData();
    await Object.keys(pet).forEach((key) => {
      if(key === "images") {
        for(let i = 0; i < pet[key].length; i++) {
          formData.append("images", pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    })

    await api.patch(`pets/${pet._id}`, formData, {
      headers : {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      toast.success(response.data.message);
      navigate("/pet/mypets");
      return response.data;
    }).catch((err) => {
      toast.error(err.response.data.message);
      return err.response.data;
    });
  };

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editado o Pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {pet.name && (
        <PetForm btnText="Atualizar" handleSubmit={updatePet} petData={pet}/>
      )}
    </section>
  );
};

export default EditPet;