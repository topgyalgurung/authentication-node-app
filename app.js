const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

const app = express();

const UserModel = require("./models/User");
const mongoURI = "mongodb+srv://username:password@cluster0.mnews.mongodb.net/";
mongoose
  .connect(mongoURI)
  .then((res) => {
    console.log("mongodb connected");
  })
  .catch((err) => console.log("mongodb connection error: ", err));

const store = new MongoDBSession({
  uri: mongoURI,
  collection: "mySessions",
});

app.set("view engine", "ejs");
// body-parser middleware : parse url-encoded bodies like form data and populate req.body property,
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// this middleware will check our req.session
const isAuth = (req, res, next) => {
  // if true or exists
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};
app.get("/", (req, res) => {
  req.session.isAuth = true;
  console.log(req.session);
  console.log(req.session.id);
  res.send("hello");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.redirect("/login");
  }
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.redirect("/login");
  }
  // save on session
  req.session.isAuth = true;
  res.redirect("/dashboard");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // check before registering if email already exist in database
  let user = await UserModel.findOne({ email });

  if (user) {
    res.redirect("/login");
  }
  // hash password before register into db
  const hashedPsw = await bcrypt.hash(password, 12); // add salt

  // if ok to register
  user = new UserModel({
    username,
    email,
    password: hashedPsw,
  });
  await user.save();
  res.redirect("/login");
});

app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

app.post("/logout", (req, res) => {
  // destroy has callback err
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(3000, console.log("server running on port 3000"));
