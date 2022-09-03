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
                ? "https://thullo-backend.herokuapp.com/" + req.file?.filename
                : "https://thullo-backend.herokuapp.com/1661239689386-default image.webp";
        if (!title || !description || !owner || !dueDate) {
            return res.status(400).send({ message: "Title, description, and due date are required" });
        }
        // console.log(req.body)

        const newTask = new TaskModel({
            title, 
            description, 
            owner, 
            status, 
            image, 
            assignedTo: JSON.parse(assignedTo),
            dueDate, 
            labels
        });

        try {
            const savedTask = await newTask.save();
            return res.status(201).send({ message: "Task created with id: " + savedTask.id });
        } catch(error) {
            // console.log(error)
            return res.status(500).send(error);
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).send(error);
    }
});

router.delete("/", async (req, res) => {
    try {
        const { id, user } = req.body;
        // console.log(req.body)
        const existingTask = await TaskModel.findById(id);
        if (!id) {
            return res.status(400).send({ message: "Task id required." });
        }
        if (user.id !== existingTask.owner) {
            return res.status(400).send({ message: "Unathorized operation." });
        }

        try {
            await TaskModel.findByIdAndDelete(id);
            return res.status(200).send({ message: "Task successfully deleted." });
        } catch(err) {
            return res.status(500).send(err);
        }
    } catch(err) {
        return res.status(500).send(err);
    }
})

router.post("/move", async (req, res) => {
    const { id, status, user } = req.body;
    const existingTask = await TaskModel.findById(id);
    // console.log(req.body, existingTask);
    if (existingTask === null) {
        return res.status(400).send({ message: "Task does not exist." });
    }
    if (user.id !== existingTask.owner && !existingTask.assignedTo.includes(user.id)) {
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
