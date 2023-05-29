const express = require('express');
const conectarBD = require('./db');

const app = express();
const PORT = 3000;

// Conectar a la base de datos
conectarBD()
  .then(() => {
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// Importar rutas
const rutas = require('./rutas');

// Configurar rutas
app.use('/', rutas);
