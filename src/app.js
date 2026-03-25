const express = require("express");
const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Inventory service is running"
  });
});

app.use("/api/products", productRoutes);
app.use("/api/inventories", inventoryRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
});

module.exports = app;
