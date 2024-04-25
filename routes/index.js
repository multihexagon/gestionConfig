const express = require("express");
var router = express.Router();
const User = require("../models/User");
const Note = require("../models/Note");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("landing", { title: "Bienvenidos" });
});

router.get("/home", function (req, res, next) {
  res.render("index", { title: "Gestión de la Configuración" }); // Cambia "notes" a "notas"
});

router.get("/notes", async function (req, res, next) {
  const notas = await Note.find(); // Cambia "notes" a "notas"
  res.render("notes", { title: "Notas", notas: notas });
});

router.post("/registro", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(200).send("Usuario registrado exitosamente");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// controlador de inicio de sesión
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      console.log("2" + username);

      res.json(user)
      //.redirect("/notes");
    } else {
      throw new Error("malo pa");
      res.status(401).send("Credenciales inválidas");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/notes/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const { title, content } = req.body;

    // Buscar y actualizar la nota en la base de datos
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    // Verificar si la nota se encontró y se actualizó correctamente
    if (!updatedNote) {
      return res.status(404).json({ error: "La nota no se encontró." });
    }

    res.json({
      message: "La nota ha sido actualizada exitosamente.",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Hubo un problema al actualizar la nota." });
  }
});

router.delete("/notes/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ error: "La nota no se encontró." });
    }
    res.json({ message: "La nota ha sido eliminada exitosamente." });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Hubo un problema al eliminar la nota." });
  }
});

module.exports = router;
