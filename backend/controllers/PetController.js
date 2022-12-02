const Pet = require("../models/Pet");

const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const { findOne } = require("../models/Pet");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({ pets: pets });
  } 

  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const images = req.files;
    const available = true;

    /* images upload */

    /* validations */
    if(!name) {
      res.status(422).json({ message: "O nome do pet é obrigatório!" });
      return;
    }

    if(!age) {
      res.status(422).json({ message: "A idade do pet é obrigatória!" });
      return;
    }

    if(!weight) {
      res.status(422).json({ message: "O peso do pet é obrigatório!" });
      return;
    }

    if(!color) {
      res.status(422).json({ message: "A cor do pet é obrigatória!" });
      return;
    }

    if(images.length === 0) {
      res.status(422).json({ message: "A imagem do pet é obrigatória!" });
      return;
    }

    /* get pet owner */
    const token = getToken(req);
    const user = await getUserByToken(token); 

    /* create a pet */
    const pet = new Pet({
      name,
      age,
      weight, 
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      }
    });

    images.map(image => pet.images.push(image.filename));

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: "Doguinho cadastrado no sistema!", newPet });
    
    } catch(err) {
      res.status(500).json({ message: err });
    }
  }

  static async getMyPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const userId = user._id
    const myPets = await Pet.find({ "user._id": userId }).sort("-createdAt");

    /* validations */
    if(myPets.length === 0) {
      res.status(201).json({ message: "Você não possui dogs cadastros em sistema!" });
      return;
    }

    res.status(201).json({ pets: myPets });
  }

  static async getAllUserAdoptions(req, res) {
    /* get user from token */
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(201).json({ pets });
  }

  static async getPetById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "Id Inválido!" });
      return;
    }

    /* check if pet exists */
    const pet = await Pet.findOne({ _id: id });

    if(!pet) {
      res.status(404).json({ message: "Pet não cadastrado!" });
      return;
    }

    res.status(200).json({ pet });
  }

  static async removePetById(req, res) {
    const id = req.params.id;

    /* check if is a valid id */
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "Id Inválido!" });
      return;
    }

    /* check if pet exists */
    const pet = await Pet.findOne({ _id: id });

    if(!pet) {
      res.status(404).json({ message: "Pet não cadastrado!" });
      return;
    }

    /* check if logged in user registered the pet */
    const token = getToken(req);
    const user = await getUserByToken(token);

    if(pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message: "Houve um erro ao processar a sua solicitação, tente novamente mais tarde!",
      });

      return;
    }

    await Pet.findByIdAndRemove(id);
    res.status(200).json({ message: "Pet removido com sucesso! "});
  }

  static async updatePet(req, res) {
    const id = req.params.id;

    /* check if is a valid id */
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "Id Inválido!" });
      return;
    }

    const { name, age, weight, color, available } = req.body;
    const images = req.files;

    const updatedData = {};

    /* check if pet exists */
    const pet = await Pet.findOne({ _id: id });

    if(!pet) {
      res.status(404).json({ message: "Pet não cadastrado!" });
      return;
    }

    /* check if logged in user registered the pet */
    const token = getToken(req);
    const user = await getUserByToken(token);

    if(pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message: "Houve um erro ao processar a sua solicitação, tente novamente mais tarde!",
      });

      return;
    }

    if(!name) {
      res.status(422).json({ message: "O nome do pet é obrigatório!" });
      return;
    } else {
      updatedData.name = name;
    }

    if(!age) {
      res.status(422).json({ message: "A idade do pet é obrigatória!" });
      return;
    } else {
      updatedData.age = age;
    }

    if(!weight) {
      res.status(422).json({ message: "O peso do pet é obrigatório!" });
      return;
    } else {
      updatedData.weight = weight;
    }

    if(!color) {
      res.status(422).json({ message: "A cor do pet é obrigatória!" });
      return;
    } else {
      updatedData.color = color;
    }

    if(images.length > 0) {
      updatedData.images = [];
      images.map(image => updatedData.images.push(image.filename));
    }

    await Pet.findByIdAndUpdate(id, updatedData);
    res.status(200).json({ message: "Pet atualizado com sucesso!" });
  }

  static async schedule(req, res) {
    const id = req.params.id;

    /* check if pet exists */
    const pet = await Pet.findOne({ _id: id });

    if(!pet) {
      res.status(404).json({ message: "Pet não cadastrado!" });
      return;
    }

    /* check if user registered the pet */
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.equals(user._id)) {
      res.status(422).json({ message: "Você não pode agendar visita com o seu próprio pet" });
      return;
    }

    /* check if user has already scheduled a visit */
    if(pet.adopter) {
      if(pet.adopter._id.equals(user._id)) {
        res.status(422).json({ message: "Você já agendou uma visita para este pet!" });
        return;
      }
    }

    /* add user to pet */
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
      phone: user.phone,
    }

    await Pet.findByIdAndUpdate(id, pet);
    res.status(200).json({
      message: `A vistia foi agendada com sucesso! entre em contato com ${pet.user.name} através do telefone ${pet.user.phone}.`,
    })
  }

  static async concludeAdoption(req, res) {
    const id = req.params.id;

    /* check if is a valid id */
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "Id Inválido!" });
      return;
    }

    /* check if pet exists */
    const pet = await Pet.findOne({ _id: id });

    if(!pet) {
      res.status(404).json({ message: "Pet não cadastrado!" });
      return;
    }

    /* check if logged in user registered the pet */
    const token = getToken(req);
    const user = await getUserByToken(token);

    if(pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message: "Houve um erro ao processar a sua solicitação, tente novamente mais tarde!",
      });

      return;
    }

    pet.available = false;
    await Pet.findByIdAndUpdate(id, pet);
    res.status(200).json({ message: "Parabéns! Você achou sarna para se coçar!" });
  }
}