const ClothingItem = require("../models/clothingItems");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    throw new BadRequestError("Please provide name, weather and imageUrl");
  }
  const owner = req.user._id;
  return ClothingItem.create({ name, weather, imageUrl, owner })
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "You don't have permission to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).json(deletedItem)
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      return res
        .status(500)
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
  deleteItem,
  likeItem,
  dislikeItem,
};
