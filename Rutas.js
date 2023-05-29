const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Exportar router
module.exports = router;
