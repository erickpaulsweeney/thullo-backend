const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
    }, 
    owner: {
        type: String,
        ref: "TaskUser",
        require: true,
    },
    image: String,
    labels: [
        {
            type: String,
        },
    ],
    assignedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TaskUser",
        },
    ],
    dueDate: {
        type: Date,
        require: true,
    },
});

const TaskModel = mongoose.model("Task", taskSchema);
module.exports = TaskModel;