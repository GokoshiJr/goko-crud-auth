const express = require("express");
const router = express.Router();
// pool = conexi db
const pool = require("../database");

router.get("", async (req, res) => { // ruta authors/¡
  res.redirect("authors/home");
});

router.get("/home", async (req, res) => { // ruta authors/
  let pagSize = 5; // tamaño de registros para mostrar
  let pag = 1; // pagina donde nos encontramos
  let empezarDesde = (pag - 1) * pagSize;
  const filas = await pool.query("SELECT COUNT(*) as numFilas FROM authors");
  const numFilas = filas[0].numFilas;
  let totalPaginas = Math.ceil(numFilas / pagSize);
  const autores = await pool.query("SELECT * FROM authors LIMIT ?, ?", [empezarDesde, pagSize])
  const arrayPag = [];
  for (let i = 1; i <= totalPaginas; i++) { arrayPag.push(i); }
  res.render("authors/list", { autores, arrayPag });
});

router.get("/pag=:pag", async (req, res) => { // ruta authors/
  let pagSize = 5; // tamaño de registros para mostrar
  let { pag } = req.params;
  let empezarDesde = (pag - 1) * pagSize;
  const filas = await pool.query("SELECT COUNT(*) as numFilas FROM authors");
  const numFilas = filas[0].numFilas;
  let totalPaginas = Math.ceil(numFilas / pagSize);
  const autores = await pool.query("SELECT * FROM authors LIMIT ?, ?", [empezarDesde, pagSize])
  const arrayPag = [];
  for (let i = 1; i <= totalPaginas; i++) { arrayPag.push(i); }
  res.render("authors/list", { autores, arrayPag });
});

// authors/add
router.get("/add", (req, res) => {
  res.render("authors/add", { ruta: "add" }); // archivo con la vista .hbs
});

router.post("/add", async (req, res) => {
  const { name, nacionality } = req.body;
  await pool.query("INSERT INTO authors (name, nacionality) VALUES (?, ?)", [
    name,
    nacionality,
  ]);
  res.redirect("/authors")
});

// authors/edit/id
router.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const author = await pool.query("SELECT * FROM authors WHERE author_id = ?", [
      id
    ]);
    res.render("authors/edit", author[0]); // archivo con la vista .hbs
  } catch (err) {
    console.log(" DB ERROR:");
    console.log(" Message:", err.sqlMessage);
    console.log(" Code:", err.code);
    res.redirect("/authors")
  }
});

router.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nacionality } = req.body;
    await pool.query("UPDATE authors SET name = ?, nacionality = ? WHERE author_id = ?", [
      name,
      nacionality,
      id
    ]);
  } catch (err) {
    console.log(" DB ERROR:");
    console.log(" Message:", err.sqlMessage);
    console.log(" Code:", err.code);
  }
  res.redirect("/authors")
});

router.get("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params; // desestructurar el objeto
    await pool.query("DELETE FROM authors WHERE author_id = ?", [id]);
  } catch (err) {
    console.log(" DB Error:");
    console.log(" Message:", err.sqlMessage);
    console.log(" Code:", err.code);
    console.log(global.linea);
  }
  res.redirect("/authors");
});

module.exports = router;
