const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  bodyParser = require("body-parser");

const saltRounds = 10;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/ISAA", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  joined: { type: Date, default: Date.now },
});

const User = mongoose.model("user", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
    const insertResult = await User.create({
      username: req.body.username,
      password: hashedPwd,
    });
    res.render("success");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
       
        res.render("verify");
      } else {
        res.render("failure");
      }
    } else {
      res.render("failure");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

app.listen(3001, () => {
  console.log("Server started at port 3001");
});