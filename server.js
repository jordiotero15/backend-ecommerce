import express from "express";
import productsRouter from "./src/routes/products.router.js";

const server = express();

const port = 8080;

server.use(express.json());
server.use("/products", productsRouter);

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

server.listen(port, () => {
  console.log(`Server ready on port: ${port}`);
});
