"use strict";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8000;

const {
    register,
    login,
    getUser,
    getLeaderboard,
    updateBalance,
    generateDeck
} = require("./handlers");

const app = express()
    .use(morgan("dev"))
    .use(express.json())
    .use(bodyParser.json())
    .use(cors());

//User
app.post("/api/register", register);
app.post("/api/login", login);

//Auth
app.get("/api/user/:_id",getUser)

//Leaderboard
app.get("/api/leaderboard",getLeaderboard)
//Balance
app.put("/api/:_id/balance",updateBalance)

app.get("/api/deck/new",generateDeck)

//.gets above
app.get("*", (req, res) => {
    res.status(404).json({
        status: 404,
        message: "This is NOT what you are looking for.",
    });
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});