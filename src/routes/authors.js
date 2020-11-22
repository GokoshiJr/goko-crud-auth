const express = require("express");
const router = express.Router();
// pool = conexi db
const pool = require("../database");

router.get("/add", (req, res) => {
  res.render("authors/add"); // archivo con la vista .hbs
});

router.post("/add", (req, res) => {
  const { name, nacionality } = req.body;
  pool.query("INSERT INTO authors (name, nacionality) VALUES (?, ?)", [name, nacionality]);
});

module.exports = router;