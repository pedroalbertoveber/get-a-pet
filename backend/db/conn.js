const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/getapet");
  console.log("Conectou ao Mongoose!");
}

main().catch(err => console.log(`Ops! Algo deu errado: ${err}.`));

module.exports = mongoose;