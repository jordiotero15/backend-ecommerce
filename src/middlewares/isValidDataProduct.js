import productsManager from "../managers/product.manager.js";


async function isValidDataProduct(req, res, next) {
    const { title, photo, category, price, stock, description, status } = req.body;

    try {
        if (!title || typeof title !== "string") {
            return res.status(400).json({ message: "Error, title is required and must be a string" });
        }

        const allProducts = await productsManager.readAll();
        const productExists = allProducts.some((product) => product.title.toLowerCase() === title.toLowerCase());
        if (productExists) {
            return res.status(400).json({ message: "Error, a product with this title already exists" });
        }

        if (photo !== undefined && typeof photo !== "string") {
            return res.status(400).json({ message: "Error, photo must be a string" });
        }

        if (category !== undefined && typeof category !== "string") {
            return res.status(400).json({ message: "Error, category must be a string" });
        }

        if (price !== undefined && (typeof price !== "number" || isNaN(price))) {
            return res.status(400).json({ message: "Error, price must be a number" });
        }

        if (stock !== undefined && (typeof stock !== "number" || isNaN(stock))) {
            return res.status(400).json({ message: "Error, stock must be a number" });
        }

        if (description !== undefined && typeof description !== "string") {
            return res.status(400).json({ message: "Error, description must be a string" });
        }

        if (status !== undefined && typeof status !== "boolean") {
            return res.status(400).json({ message: "Error, status must be a boolean" });
        }

        req.body.photo = photo || "default-product-img.jpg";
        req.body.category = category || "unknown";
        req.body.price = price || 1;
        req.body.stock = stock || 1;
        req.body.description = description || "unknown";
        req.body.status = status !== undefined ? status : true;

        return next();
    } catch (error) {
        return next(error);
    }
}

export default isValidDataProduct;