const User = require("../models/User");

/* external modules */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* helpers */
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");


module.exports = class UserController {
  static async register(req, res) {
    
    const {
      name,
      email, 
      phone,
      password,
      confirmpassword,
    } = req.body;

    /* validations */

    if(!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }
    if(!email) {
      res.status(422).json({ message: "O E-mail é obrigatório!" });
      return;
    }
    if(!phone) {
      res.status(422).json({ message: "O Telefone é obrigatório!" });
      return;
    }
    if(!password) {
      res.status(422).json({ message: "A Senha é obrigatória!" });
      return;
    }
    if(!confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatória!" });
      return;
    }
    if(password !== confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha não é igual a senha!" });
      return;
    }

    /* check if user exists */
    const userExists = await User.findOne({ email: email });

    if(userExists) {
      res.status(422).json({ message: "Este e-mail já está cadastrado. Favor utilizar outro e-mail!" });
      return;
    }

    /* create a password */
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name, 
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);

    } catch(err) {
      res.status(500).json({ message: err });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    /* validations */
    if(!email) {
      res.status(422).json({ message: "O E-mail é obrigatório!" });
      return;
    }

    if(!password) {
      res.status(422).json({ message: "A Senha é obrigatória!" });
      return;
    }

    /* check if user exists */
    const user = await User.findOne({ email: email });

    if(!user) {
      res.status(422).json({ message: "Usuário não cadastrado!"});
      return;
    }

    /* check if password matches */
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "Senha incorreta! Tente novamente."});
      return;
    }

    try {
      await createUserToken(user, req, res);
    } catch(err) {
      res.status(500).json({ message: err});
    }
  }

  static async checkUser(req, res) {
    let currentUser;

    if(req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;

    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
    } else {
      res.status(200).json({ user });
    }
  }

  static async editUser(req, res) {

    const id = req.params.id;

    const token = getToken(req);
    const user = await getUserByToken(token);

    if(!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    const { name, email, phone, password, confirmpassword } = req.body;

    if(req.file) {
      user.image = req.file.filename;
    }



    /* validations */
    if(!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    user.name = name;

    if(!email) {
      res.status(422).json({ message: "O E-mail é obrigatório!" });
      return;
    }

    /* check if email has already taken */
    const userExists = await User.findOne({ email: email });

    if(user.email !== email && userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
      return;
    }

    user.email = email;

    if(!phone) {
      res.status(422).json({ message: "O Telefone é obrigatório!" });
      return;
    }

    user.phone = phone;

    /* check if password match */
    if(password !== confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha não é igual a senha!" });
    
      /* change password */
    } else if ( password == confirmpassword && password != null) {

      /* create a password */
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }
    
    try {
      /* returns user updated data */
      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id }, 
        { $set: user }, 
        { new: true },
      );

      res.status(200).json({ message: "Usuário atualizado por sucesso!", data: updatedUser });
    } catch(err) {
      res.status(500).json({ message: "Erro ao rodar o código" });
    }
  }
}