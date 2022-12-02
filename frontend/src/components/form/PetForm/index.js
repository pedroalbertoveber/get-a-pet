/* external modules */
import { useState } from "react";

/* components */
import Input from "components/form/Input";
import Select from "components/form/Select";

/* styles */
import formStyles from "../Form.module.css";


const PetForm = ({ handleSubmit, petData, btnText }) => {
  const [ pet, setPet ] = useState(petData || {});
  const [ preview, setPreview ] = useState([]);
  const colors = [ "Branco", "Preto", "Cinza", "Caramelo", "Vermeio" ];

  const onFileChange = (e) => {
    setPreview(Array.from(e.target.files))
    setPet({ ...pet, images: [...e.target.files] });
  };

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleColor = (e) => {
    setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text });
  };

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(pet);
  }

  return (
    <form className={formStyles.form_container} onSubmit={submit}>
      <div className={formStyles.preview_pet_images}>
        {preview.length > 0
        ? preview.map((img, index) => ( 
          <img src={URL.createObjectURL(img)} alt={pet.name} key={`${pet.name}+${index}`}/>
        )) : pet.images &&
        pet.images.map((img, index) => (
          <img src={`http://localhost:5000/images/pets/${img}`} alt={pet.name} key={`${pet.name}+${index}`}/>
        ))
        }
      </div>
      <Input 
        text="Imagens do Pet"
        type="file"
        name="images"
        handleOnChange={onFileChange}
        multiple={true}
      />
      <Input 
        text="Nome do Pet"
        type="text"
        name="name"
        handleOnChange={handleChange}
        value={pet.name || ""}
        placeholder="Digite o nome do Pet"
      />
      <Input 
        text="Idade do Pet"
        type="text"
        name="age"
        handleOnChange={handleChange}
        value={pet.age || ""}
        placeholder="Digite a idade do Pet"
      />
      <Input 
        text="Peso do Pet"
        type="number"
        name="weight"
        handleOnChange={handleChange}
        value={pet.weight || ""}
        placeholder="Digite o peso do Pet"
      />

      <Select 
        name="color"
        text="Selecione a cor"
        handleOnChange={handleColor}
        value={pet.color || ""}
        options={colors}
      />
      <input type={"submit"} value={btnText}/>
    </form>
  );
};

export default PetForm;