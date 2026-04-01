const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
    text: String,
    votes: Number
});

const pollSchema = new mongoose.Schema({
    question: String,
    options: [optionSchema]
});

module.exports = mongoose.model("Poll", pollSchema);