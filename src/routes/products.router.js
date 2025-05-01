import express from "express";
import productsManager from "../managers/product.manager.js";
import isValidDataProduct from "../middlewares/isValidDataProduct.js";

const router = express.Router();

router.post("/", isValidDataProduct, async (req, res, next) => {
  try {
    const id = await productsManager.create(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    const products = await productsManager.readAll(category);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:pid", async (req, res, next) => {
  try {
    const product = await productsManager.readOne(req.params.pid);
    product
      ? res.json(product)
      : res.status(404).json({ message: "Product not found" });
  } catch (err) {
    next(err);
  }
});

router.put("/:pid", async (req, res, next) => {
  try {
    const updated = await productsManager.update(req.params.pid, req.body);
    updated
      ? res.json(updated)
      : res.status(404).json({ message: "Product not found" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:pid", async (req, res, next) => {
  try {
    const message = await productsManager.destroy(req.params.pid);
    message
      ? res.json({ message })
      : res.status(404).json({ message: "Product not found" });
  } catch (err) {
    next(err);
  }
});

export default router;
