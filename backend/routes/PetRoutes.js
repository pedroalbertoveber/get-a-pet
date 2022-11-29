const router = require("express").Router();

/* controller */
const PetController = require("../controllers/PetController");

/* middlewares */
const verifyToken = require("../helpers/verify-token");

router.post("/create", verifyToken, PetController.create);

module.exports = router;