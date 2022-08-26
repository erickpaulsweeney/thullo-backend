const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TaskUserModel = mongoose.model("TaskUser", userSchema);
module.exports = TaskUserModel;
