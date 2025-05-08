const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
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

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
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

module.exports = { getUsers, createUser, getUser };
