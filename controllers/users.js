const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      return res.status(201).json(userResponse);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BadRequestError.statusCode)
          .json({ message: "Invalid data provided" });
      }
      if (err.code === "11000") {
        return res
          .status(ConflictError.statusCode)
          .json({ message: "This email is already in use" });
      }
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .json({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError.statusCode)
          .json({ message: "Invalid user ID" });
      }
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BadRequestError.statusCode)
      .json({ message: "Email and password are required" });
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UnauthorizedError.statusCode)
          .json({ message: "Incorrect email or password" });
      }
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error has occurred on the server" });
    });
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .json({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BadRequestError.statusCode)
          .json({ message: "Invalid data provided" });
      }
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error occurred on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
