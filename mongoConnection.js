const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { createUser, validateUser };