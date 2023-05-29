const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://nenriquemolinari:1p0Qc5wkq3t5Njv8@cluster0.ckuzeju.mongodb.net/';

const conectarBD = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};

module.exports = conectarBD;
