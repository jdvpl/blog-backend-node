const mongoose = require('mongoose')

const dbConection=async()=>{
  try {

    // opciones {autoIndex:false,}
    await mongoose.connect(process.env.MONGODBCOONECTION)
    console.log("Base de datos conectada");
  } catch (error) {
    console.log(error);
    throw new Error("Error en la conexion a la base de datos")
  }
}

module.exports = {dbConection};