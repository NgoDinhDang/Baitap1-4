const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

productSchema.post("save", async function createInventoryForProduct(doc, next) {
  try {
    const Inventory = mongoose.model("Inventory");

    await Inventory.findOneAndUpdate(
      { product: doc._id },
      {
        $setOnInsert: {
          product: doc._id,
          stock: 0,
          reserved: 0,
          soldCount: 0
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Product", productSchema);
