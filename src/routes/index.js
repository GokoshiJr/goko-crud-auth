// para almacenar todas las rutas de la app
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("inicio")
});

module.exports = router;
