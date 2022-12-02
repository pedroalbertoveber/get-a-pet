/* external modules */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* styles */
import styles from "./AddPet.module.css";

/* components */
import PetForm from "components/form/PetForm";

/* api */
import api from "utils/api";

const AddPet = () => {
  const [ token ] = useState(localStorage.getItem("token" || ""));
  const navigate = useNavigate();

  const registerPet = async (pet) => {
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

    await api.post("pets/create", formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      toast.success(response.data.message);
      navigate("/pet/mypets");
      return response.data;
    }).catch((err) => {
      toast.error(err.response.data.message)
      return err.response.data
    })
  }

  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre seu Pet</h1>
        <p>Depois ele ficará disponível para adoção</p>
      </div>
      <PetForm btnText="Cadastrar" handleSubmit={registerPet}/>
    </section>
  );
};

export default AddPet;