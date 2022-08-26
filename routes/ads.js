const express = require("express");
const multer = require("multer");
const TaskModel = require("../models/task");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    try {
        const list = await TaskModel.find({})
            .populate("owner", "name")
            .populate("assignedTo", "name");

        return res.status(200).json(list);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title, description, owner, status, assignedTo, dueDate, labels } = req.body;
        const image =
            req.file !== undefined
                ? "https://localhost:8000/" + req.file?.filename
                : "https://localhost:8000/1661239689386-default image.webp";
        if (!title || !description || !owner || !dueDate) {
            return res.status(400).send({ message: "Title, description, and due date are required" });
        }

        const newTask = new TaskModel({
            title, 
            description, 
            owner, 
            status, 
            assignedTo,
            dueDate, 
            labels
        });

        try {
            const savedTask = await newTask.saved();
            return res.status(201).send({ message: "Task created with id: " + savedTask.id });
        } catch(error) {
            return res.status(500).send(error);
        }
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post("/move", async (req, res) => {
    const { id, status, user } = req.query;
    const existingTask = await TaskModel.findById(id);
    if (existingTask === null) {
        return res.status(400).send({ message: "Task does not exist." });
    }
    if (user !== existingTask.owner || !existingTask.assignedTo.includes(user)) {
        return res.status(401).send({ message: "Unauthorized operation." });
    }

    try {
        await TaskModel.findByIdAndUpdate(id, { status: status });
        return res.status(200).send({ message: "Task successfully updated." });
    } catch(error) {
        return res.status(501).send(error);
    }
})

module.exports = router;
