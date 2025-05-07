const ClothingItem = require("../models/clothingItems");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BadRequestError.statusCode)
          .send({ message: "Invalid data provided" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .send({ message: "Item not found" });
      }
      return res
        .status(InternalServerError.statusCode)
        .send({ message: "An error occurred on the server" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError.statusCode)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BadRequestError.statusCode)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(InternalServerError.statusCode)
        .send({ message: "An error occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .send({ message: "Item not found" });
      }
      return res
        .status(InternalServerError.statusCode)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
