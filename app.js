const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./DB/dbconnection");
const dotenv = require("dotenv");
const user = require("./model/user");
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;

const http = require("http");
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("dev"));




app.get('/api/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.json({ ip });
});


// Routes
app.get("/api/newuser", async (req, res) => {
  try {
    const users = await user.find().sort({ date: -1 });;
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

app.post("/api/savenewuser", async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
 const newUser = new user({
      ...req.body,
      ipaddress: ip 
    });
    const users = await newUser.save();



    res.json(users);
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Server error while saving user" });
  }
});

app.get("/api/getuser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const singleUser = await user.findById(userId);

    if (!singleUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(singleUser);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Server error while fetching user" });
  }
});

app.delete("/api/deleteuser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await user.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error while deleting user" });
  }
});

app.put("/api/updateuser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await user.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error while updating user" });
  }
});

app.get("/api/userlogin", async (req, res) => {
  try {
    const name = req.query.name;
    const singleUser = await user.findOne({ name });

    if (!singleUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(singleUser);
  } catch (err) {
    console.error("Error fetching user by name:", err);
    res.status(500).json({ error: "Server error while fetching user" });
  }
});



app.listen(3000, () => console.log("Server running"));
module.exports = app;
