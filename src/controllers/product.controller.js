const Product = require("../models/product.model");

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProduct
};
