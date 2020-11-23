const express = require("express");
const router = express.Router();
// pool = conexi db
const pool = require("../database");

router.get("/", async (req, res) => {
  // ruta authors/
  const autores = await pool.query("SELECT * FROM authors");
  res.render("authors/list", { autores });
});

router.get("/add", (req, res) => {
  res.render("authors/add"); // archivo con la vista .hbs
});

router.post("/add", async (req, res) => {
  const { name, nacionality } = req.body;
  await pool.query("INSERT INTO authors (name, nacionality) VALUES (?, ?)", [
    name,
    nacionality,
  ]);
  res.send("Recibido");
});

module.exports = router;
