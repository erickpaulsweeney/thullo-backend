const express = require("express");
const TaskUserModel = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const list = await TaskUserModel.find({});
        return res.status(200).json(list);
    } catch(error) {
        return res.status(500).send(error);
    }
    
});

module.exports = router;
