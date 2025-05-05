import express from "express";
import cartsManager from "../managers/carts.manager.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const id = await cartsManager.create(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

router.post("/:cid/product/:pid", async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      let quantity = 1;

      if (req.body && req.body.quantity) {
        const parsed = parseInt(req.body.quantity);
        if (!isNaN(parsed) && parsed > 0) quantity = parsed;
      }
      const updatedCart = await cartsManager.addProduct(cid, pid, quantity);

      if (!updatedCart) {
        return res.status(404).json({ message: "Cart id not found" });
      }
  
      res.status(200).json(updatedCart);
    } catch (err) {
      next(err);
    }
  });
  

router.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    const carts = await cartsManager.readAll(category);
    res.json(carts);
  } catch (err) {
    next(err);
  }
});

router.get("/:cid", async (req, res, next) => {
  try {
    const cart = await cartsManager.readOne(req.params.cid);
    cart
      ? res.json(cart)
      : res.status(404).json({ message: "Cart id not found" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:cid", async (req, res, next) => {
  try {
    const message = await cartsManager.destroy(req.params.cid);
    message
      ? res.json({ message })
      : res.status(404).json({ message: "Cart id not found" });
  } catch (err) {
    next(err);
  }
});

export default router;
