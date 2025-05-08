const ClothingItem = require("../models/clothingItems");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  if (!name || !weather || !imageURL) {
    return res.status(BadRequestError.statusCode).json({
      message: "Please provide name, weather and imageUrl",
    });
  }
  const owner = req.user._id;
  return ClothingItem.create({ name, weather, imageURL, owner })
    .then((item) => {
      res.status(201).json(item.toObject());
    })
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

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).json(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .json({ message: "Item not found" });
      }
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error occurred on the server" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError.statusCode)
          .json({ message: "Invalid item ID" });
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

const deleteItem = (req, res) => {
  const { _id: itemId } = req.params;

  return ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).json({ message: "Item deleted" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError.statusCode)
          .json({ message: "Invalid item ID" });
      }
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error occurred on the server" });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError.statusCode)
          .json({ message: "Invalid item ID" });
      }
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error occurred on the server" });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError.statusCode)
          .json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError.statusCode)
          .json({ message: "Invalid item ID" });
      }
      return res
        .status(InternalServerError.statusCode)
        .json({ message: "An error occurred on the server" });
    });

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
