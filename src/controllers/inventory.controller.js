const mongoose = require("mongoose");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");
const HttpError = require("../utils/http-error");

function validateObjectId(id, fieldName) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, `${fieldName} is invalid`);
  }
}

function validateQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, "quantity must be an integer greater than 0");
  }
}

async function ensureProductExists(productId) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new HttpError(404, "Product not found");
  }
}

async function getAllInventories(req, res, next) {
  try {
    const inventories = await Inventory.find().populate("product");

    res.json({
      message: "Get all inventories successfully",
      data: inventories
    });
  } catch (error) {
    next(error);
  }
}

async function getInventoryById(req, res, next) {
  try {
    const { id } = req.params;
    validateObjectId(id, "Inventory ID");

    const inventory = await Inventory.findById(id).populate("product");

    if (!inventory) {
      throw new HttpError(404, "Inventory not found");
    }

    res.json({
      message: "Get inventory successfully",
      data: inventory
    });
  } catch (error) {
    next(error);
  }
}

async function addStock(req, res, next) {
  try {
    const { product, quantity } = req.body;

    validateObjectId(product, "product");
    validateQuantity(quantity);
    await ensureProductExists(product);

    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { $inc: { stock: quantity } },
      { new: true }
    ).populate("product");

    if (!inventory) {
      throw new HttpError(404, "Inventory not found");
    }

    res.json({
      message: "Add stock successfully",
      data: inventory
    });
  } catch (error) {
    next(error);
  }
}

async function removeStock(req, res, next) {
  try {
    const { product, quantity } = req.body;

    validateObjectId(product, "product");
    validateQuantity(quantity);

    const inventory = await Inventory.findOneAndUpdate(
      {
        product,
        stock: { $gte: quantity }
      },
      { $inc: { stock: -quantity } },
      { new: true }
    ).populate("product");

    if (!inventory) {
      throw new HttpError(400, "Not enough stock or inventory not found");
    }

    res.json({
      message: "Remove stock successfully",
      data: inventory
    });
  } catch (error) {
    next(error);
  }
}

async function reserveStock(req, res, next) {
  try {
    const { product, quantity } = req.body;

    validateObjectId(product, "product");
    validateQuantity(quantity);

    const inventory = await Inventory.findOneAndUpdate(
      {
        product,
        stock: { $gte: quantity }
      },
      {
        $inc: {
          stock: -quantity,
          reserved: quantity
        }
      },
      { new: true }
    ).populate("product");

    if (!inventory) {
      throw new HttpError(400, "Not enough stock or inventory not found");
    }

    res.json({
      message: "Reserve stock successfully",
      data: inventory
    });
  } catch (error) {
    next(error);
  }
}

async function soldStock(req, res, next) {
  try {
    const { product, quantity } = req.body;

    validateObjectId(product, "product");
    validateQuantity(quantity);

    const inventory = await Inventory.findOneAndUpdate(
      {
        product,
        reserved: { $gte: quantity }
      },
      {
        $inc: {
          reserved: -quantity,
          soldCount: quantity
        }
      },
      { new: true }
    ).populate("product");

    if (!inventory) {
      throw new HttpError(400, "Not enough reserved quantity or inventory not found");
    }

    res.json({
      message: "Sold stock successfully",
      data: inventory
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllInventories,
  getInventoryById,
  addStock,
  removeStock,
  reserveStock,
  soldStock
};
