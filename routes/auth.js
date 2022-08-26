const express = require("express");
const bcrypt = require("bcrypt");
const TaskUserModel = require("../models/user");
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { email, name, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
        return res.status(400).send({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
        return res.status(400).send({ message: "Passwords do not match." });
    }

    const existingUser = await TaskUserModel.findOne({ email: email });
    if (existingUser !== null) {
        return res.status(400).send({ message: "Email already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new TaskUserModel({
        name,
        email,
        password: hash,
    });

    try {
        const savedUser = await newUser.save();
        return res
            .status(201)
            .send({ message: "User created with id: " + savedUser.id });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post("/login", async (req, res) => {
    const { emailIn, password } = req.body;
    if (!emailIn || !password) {
        return res.status(400).send({ message: "All fields are required." });
    }

    const findUser = await TaskUserModel.findOne({ email: emailIn });
    if (findUser === null) {
        return res.status(400).send({ message: "User does not exist. Please sign up first." });
    }

    const verify = await bcrypt.compare(password, findUser.password);
    if (!verify) {
        return res.status(400).send({ message: "Incorrect password." })
    }

    const { id, name, email, tasks } = findUser;
    return res.status(200).json({ id, name, email, tasks });
});

module.exports = router;
