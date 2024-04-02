const express = require("express");
var router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("landing", { title: "Bienvenidos" });
});

router.get("/home", function (req, res, next) {
  res.render("index", { title: "Gestión de la Configuración" });
});

router.get("/notes", function (req, res, next) {
  res.render("notes", { title: "Notas" });
});

router.post('/registro', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// controlador de inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.redirect('/notes');
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});


module.exports = router;
