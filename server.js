const express = require("express")
const mongoose = require("mongoose")
const User = require("./models")

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const uName = process.env.UNAME 
const password = process.env.PASSWORD
const server = process.env.SERVER
const database = process.env.DATABASE
const url = `mongodb+srv://${uName}:${password}@${server}/${database}?retryWrites=true&w=majority`

mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", function(){
    console.log("MongoDB Connected Successfully~")
})

// CREATE
app.post('/add_praktikan', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user)
    } catch(err) {
        res.status(400).send(err)
    }
})

// REQUEST
app.get("/view_praktikan", async (req, res) => {
    const users = await User.find({});
    try {
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// UPDATE
app.patch("/update_praktikan/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

// DELETE
app.delete("/delete_praktikan/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) res.status(404).send("No praktikan found");
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(3000, () => {
    console.log("Server is running at port 3000!~")
})