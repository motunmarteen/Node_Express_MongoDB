import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Registration from "./models/registration.js";

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Resolve __dirname in ES6 modules
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 2000;

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/GoMyCode", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Serve static files from the public directory
app.use(express.static(`${__dirname}/public`));

// Handle form submissions
app.post("/submit", async (req, res) => {
  try {
    const registrationData = new Registration(req.body);
    await registrationData.save();
    res.status(200).send("Registration successful!");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("An error occurred during registration.");
  }
});

// Get all registrations
app.get("/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).send("An error occurred while fetching registrations.");
  }
});

// Get a specific registration by ID
app.get("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (registration) {
      res.json(registration);
    } else {
      res.status(404).send("Registration not found.");
    }
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).send("An error occurred while fetching the registration.");
  }
});

// Update a specific registration by ID
app.put("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (registration) {
      res.json(registration);
    } else {
      res.status(404).send("Registration not found.");
    }
  } catch (error) {
    console.error("Error updating registration:", error);
    res.status(500).send("An error occurred while updating the registration.");
  }
});

// Delete a specific registration by ID
app.delete("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (registration) {
      res.json({ message: "Registration deleted successfully." });
    } else {
      res.status(404).send("Registration not found.");
    }
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).send("An error occurred while deleting the registration.");
  }
});

// Search for registrations by name
app.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const registrations = await Registration.find({
      full_name: new RegExp(q, "i"),
    });
    res.json(registrations);
  } catch (error) {
    console.error("Error searching registrations:", error);
    res
      .status(500)
      .send("An error occurred while searching for registrations.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});