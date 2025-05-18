import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import expressSession from "express-session";
import flash from "connect-flash";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import isAuthenticated from './auth/auth.js';

import dotenv from "dotenv";
dotenv.config();

var app = express();

import cors from "cors";
app.use(
  cors({
    origin: [process.env.Frontend_URL, "http://localhost:5173"], // Your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import feedRouter from "./routes/feed.js";
import usersRouter from "./routes/users.js";
import confessionsRouter from "./routes/confessions.js";
import authRouter from "./routes/auth.js";
import passport from "passport";
import passportConfig from "./config/passport.js";
passportConfig();


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.set("trust proxy", 1);

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60 // 1 day in seconds
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none", 
      secure: true  
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});
app.use("/auth",authRouter);
app.use("/feed", isAuthenticated,feedRouter);
app.use("/users", isAuthenticated,usersRouter);
app.use("/confessions", isAuthenticated,confessionsRouter);
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error 
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
