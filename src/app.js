const express = require("express");
const router = express.Router();
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const mainRoutes = require("./express-application-mvc/backend/routes/htmlRoutes");

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.set("views", __dirname + "/express-application-mvc/client/views");

app.engine("html", require("ejs").renderFile);

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/express-application-mvc/client")));



app.use(logger("dev"));

app.use(
  session({
    secret: "KonfinitySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: null,
    },
  })
);

app.use("/", mainRoutes);

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.listen(3000);

module.exports = app;


