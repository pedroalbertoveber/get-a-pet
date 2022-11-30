/* external modules */
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

/* api */
import api from "utils/api";

/* styles */
import styles from "./Profile.module.css";
import formStyles from "components/form/Form.module.css";

/* components */
import Input from "components/form/Input";
import RoundedImage from "components/layout/RoundedImage";

const Profile = () => {

  const [ user, setUser ] = useState({});
  const [ preview, setPreview ] = useState("");
  const [ token ] = useState(localStorage.getItem("token") || "");

  useEffect(() => {

    api.get("/users/checkuser", {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }).then((response) => {
      setUser(response.data);
    })

  }, [token])

  const onFileChange = (e) => {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    await Object.keys(user).forEach((key) => formData.append(key, user[key]));

    await api.patch(`/users/edit/${user._id}`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      toast.success(response.data.message);
    }).catch((err) => {
      toast.error(err.response.data.message);
    });
  }

  return(
    <section>
      <div className={styles.profile_header}>
        <h1>Perfil</h1>
        {(user.image || preview) && (
          <RoundedImage imgPath={preview ? URL.createObjectURL(preview) : `http://localhost:5000/images/users/${user.image}`} alt={user.name}/>
        )}
      </div>
      <form className={formStyles.form_container} onSubmit={handleSubmit}>
        <Input 
          text="Imagem"
          name="image"
          type="file"
          handleOnChange={onFileChange}
        />
        <Input 
          text="Nome"
          name="name"
          type="text"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
          value={user.name || ""}
        />
        <Input 
          text="Telefone"
          name="phone"
          type="text"
          placeholder="Digite o seu telefone"
          handleOnChange={handleChange}
          value={user.phone || ""}
        />
        <Input 
          text="E-mail"
          name="email"
          type="email"
          placeholder="Digite o seu email"
          handleOnChange={handleChange}
          value={user.email || ""}
        />
        <Input 
          text="Senha"
          name="password"
          type="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        />
        <Input 
          text="Confirmação de Senha"
          name="confirmpassword"
          type="password"
          placeholder="Confirme sua senha"
          handleOnChange={handleChange}
        />
        <input type={"submit"} value="Alterar"/>
      </form>
    </section>
  );
};

export default Profile;