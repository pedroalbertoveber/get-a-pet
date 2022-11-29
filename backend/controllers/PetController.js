const Pet = require("../models/Pet");

const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
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

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: "Doguinho cadastrado no sistema!", newPet });
    
    } catch(err) {
      res.status(500).json({ message: err });
    }
  }
}