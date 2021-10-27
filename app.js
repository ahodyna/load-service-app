const express = require("express");
const path = require("path");
const morgan = require("morgan");

const ErrorHandler = require("./errors/ErrorHandler");

const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

const { DB_CONNECT_URL, PORT } = require("./configs/config");
mongoose.connect(DB_CONNECT_URL);


app.use(express.json());
app.use(morgan("combined"));

const staticPath = path.join(__dirname, "static");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});


const { authRouter, loadRouter, userRouter, truckRouter } = require("./routers");

app.use("/api/auth/", authRouter);
app.use("/api/users/me/", userRouter);
app.use("/api/loads/", loadRouter);
app.use("/api/trucks/", truckRouter);


app.use((err, req, res, next) => {
    if (err instanceof ErrorHandler) {
        return res.status(err.status).json({ "message": err.customCode })
    } else if (err) {
        console.log(err)
        return res.status(500).json({ "message": "Error message" })
    }
});
