const express = require("express");
const router = express.Router();

console.log("comentario");

// Definir rutas
router.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

// Exportar router
module.exports = router;

console.log("prueba commit");
