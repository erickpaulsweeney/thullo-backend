const { application } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

const DB_URI =
    "mongodb+srv://erick_paul:test1234@cluster0.bhdvtow.mongodb.net/?retryWrites=true&w=majority";

mongoose
    .connect(DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

app.use(cors());
app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.listen(process.env.PORT || 8000);