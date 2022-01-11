const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const assert = require("assert");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//REGISTER
const register = async (req,res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { username, password } =
        req.body;

    try {
        await client.connect();
        const db = client.db("Casino");
        //check if username already exists
        const check = await db.collection("users").findOne({ username });
        if (check) {
            await client.close();
            return res.status(400).json({
                status: 400,
                message: "Username already exists",
            });
        }

        //create user
        const _id = uuidv4();
        const hashedPassword = await bcrypt.hash(
            password,
            await bcrypt.genSalt(10)
        );
        const user = {
            _id,
            username,
            password: hashedPassword,
            balance:1000
        };

        const result = await db.collection("users").insertOne(user);
        assert.equal(true, result.acknowledged);
        await client.close();
        delete user.password;

        return res.status(201).json({ status: 201, message: "success", user });
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message });
    }
}
//LOGIN
const login = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { username, password } = req.body;
    try {
        await client.connect();
        const db = client.db("Casino");

        const result = await db.collection("users").findOne({ username });
        await client.close();

        if (!result) {
            return res.status(400).json({
                status: 400,
                message: "Username or Password is wrong",
            });
        } else {
            const check = await bcrypt.compare(password, result.password);
            if (!check) {
                return res.status(400).json({
                    status: 400,
                    message: "Username or Password is wrong",
                });
            } else {
                return res
                    .status(200)
                    .json({ status: 200, user: result });
            }
        }
    } catch (err) {
        return res.status(500).json({ status: 500, message: err });
    }
};
//AUTH USER
const getUser = async (req,res)=>{
    const _id = req.params._id;
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Casino");
        const user = await db.collection("users").findOne({ _id });
        await client.close();
        if (user) {
            delete user.password;
            res.status(200).json({ status: 200, user });
        } else {
            res.status(404).json({
                status: 404,
                message: "ERROR: User not found.",
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error });
    }
}
const getLeaderboard = async (req,res)=>{
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Casino");
        //SORT ARRAY BY SCORE AND HIDE PASSWORD
        const users = await db.collection("users").find({}, { projection: { password: 0 } }).sort({balance:-1}).toArray();
        await client.close();
        res.status(200).json({status:200,data:users})
    } catch (error) {
        res.status(500).json({ status: 500, message: error });
    }
}
//UPDATE BALANCE
const updateBalance = async (req,res)=>{
    const _id = req.params._id;
    const {bet,outcome} = req.body
    console.log(req.body)
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Casino");
        const user = await db.collection("users").findOne({ _id });

        let result = null;
        if(outcome === "win"){
            result = await db.collection("users").updateOne({_id},{$set:{balance:user.balance+bet*2}})
            assert.equal(1,result.modifiedCount)
        }else{
            result = await db.collection("users").updateOne({_id},{$set:{balance:user.balance-bet}})
            assert.equal(1,result.modifiedCount)
        }
        const updatedUser = await db.collection("users").findOne({ _id });
        return res.status(200).json({status: 200,message: `${outcome} ${bet}$`,balance:updatedUser.balance})
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
}

//BLACKJACK
const generateDeck = async (req,res)=>{
    const cards = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
    const suits = ['♦','♣','♥','♠'];
    const deck = [];
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        deck.push({number: cards[i], suit: suits[j]});
      }
    }
    return res.status(200).json({status: 200,deck:deck});
}

module.exports = { register, login, getUser,getLeaderboard,updateBalance,generateDeck };