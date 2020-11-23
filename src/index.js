const express = require("express"); // framework de node
const path = require("path"); // nativo de node
const morgan = require("morgan"); // middleware
const { urlencoded } = require("express"); // para recibir los datos del form html
const exhbs = require("express-handlebars");

// para la conexion con la bd
const mysql = require("mysql");
const mysqlConnection = require("express-myconnection");

// initializations
const app = express();

// settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
// configurando el motor de plantilla handlebar
app.engine(
  ".hbs",
  exhbs({
    defualtLayout: "main", // partes comunes de la navegacion
    layoutsDir: path.join(app.get("views"), "layouts"), // indicar donde estan los layouts
    partialsDir: path.join(app.get("views"), "partials"), // indicar donde estan los partials
    extname: ".hbs", // especificar la extension mas resumida, en lugar de .handlebars
    helpers: require("./lib/handlebars"), // para usar las funciones que estan en lib
  })
);
app.set("view engine", ".hbs");

// middlewares
app.use(morgan("dev"));
// app.use(mysqlConnection(mysql, database, 'single'));
// urlencoded para recibir los datos de los formularios html, extended false (no imagenes)
app.use(urlencoded({ extended: false }));
// para enviar/recibir json
app.use(express.json());

// global variables
app.use((req, res, next) => {
  // middleware
  /*
    req, toma la info del usuario 
    res, toma lo que el servidor quiere responder
    next, una funcion para continuar con el resto del codigo
  */
  next();
});

// routes
const indexRoute = require("./routes/index");
const authenticationRoute = require("./routes/authentication");
const authorsRoute = require("./routes/authors");
app.use("/", indexRoute);
app.use("/authors", authorsRoute);
app.use("/auth", authenticationRoute);

// public
app.use("/public", express.static(path.join(__dirname, "public")));

// starting the server
app.listen(app.get("port"), () => {
  console.log(`--- Server on port ${app.get("port")} ---`);
});
