//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const encrypt = require('mongoose-encryption');
const md5 = require("md5");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// connect mongodb
mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(() =>{
    console.log("Successfully connected mongodb...");
}).catch((err) =>{
    console.log(err);
});

// create schema
const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

// encrypt password using mongoose-encryption
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

// create model
const User =  mongoose.model("Users",userSchema);


app.get("/",(req,res) =>{
    res.render("home");
});

app.get("/login",(req,res) =>{
    res.render("login");
});

app.get("/register",(req,res) =>{
    res.render("register");
});

app.post("/register",(req,res) =>{
    const newUser = new User({
        email : req.body.username,
        password : md5(req.body.password)
    });

    newUser.save((err) =>{
        if(err){
            res.send(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login",(req,res) =>{
    const userName = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email:userName},(err,foundUser) =>{
        if(err){
            res.send(err);
        }else{
            if(foundUser){
                if(foundUser.password === password ){
                    res.render("secrets");
                }else{
                    res.send("Username or Password worng....");
                }
            }
        }
    });
});


app.listen("3000",() =>{
    console.log("Server Start on port 3000...");
});