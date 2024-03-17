const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://juanpablo:juan1208@cluster0.vopkkyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Initialize a new MongoClient with specified server options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Define a schema for user credentials
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Function to create a new user
async function createUser(username, password) {
  try {
    await client.connect();
    await client.db("myLoginDB").collection("users").insertOne({ username: username, password: password });
    console.log("User created successfully.");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await client.close();
  }
}

// Function to validate user credentials for login
async function validateUser(username, password) {
  try {
    await client.connect();
    const foundUser = await User.findOne({ username: username, password: password });
    if (foundUser) {
      console.log("User validated successfully.");
      return true;
    } else {
      console.log("Invalid username or password.");
      return false;
    }
  } catch (error) {
    console.error("Error validating user:", error);
    return false;
  } finally {
    await client.close();
  }
}

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Gestión de la Configuración" });
});

router.get("/home", function (req, res, next) {
  res.render("landing", { title: "Bienvenidos!" });
});

// Route to handle new user creation
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  await createUser(username, password);
  res.send('User created successfully!');
});

// Route to handle login validation
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const isValid = await validateUser(username, password);
  if (isValid) {
    res.send('Login successful!');
  } else {
    res.send('Invalid username or password.');
  }
});

module.exports = router;
