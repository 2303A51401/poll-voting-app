const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Poll = require("./models/Poll");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/pollDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ================= POLL APIs =================

// Create poll
app.post("/create", async (req, res) => {
    const { question, options } = req.body;

    const poll = new Poll({
        question,
        options: options.map(opt => ({ text: opt, votes: 0 }))
    });

    await poll.save();
    res.json(poll);
});

// Get polls
app.get("/polls", async (req, res) => {
    const polls = await Poll.find();
    res.json(polls);
});

// Vote
app.post("/vote", async (req, res) => {
    const { pollId, optionIndex } = req.body;

    const poll = await Poll.findById(pollId);
    poll.options[optionIndex].votes += 1;

    await poll.save();
    res.json(poll);
});

// ================= AUTH APIs =================

// Register
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashed
    });

    await user.save();
    res.json({ message: "User registered" });
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({ token });
});

// ============================================

app.listen(5000, () => console.log("Server running on port 5000"));