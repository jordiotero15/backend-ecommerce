import fs from "fs";
import crypto from "crypto";

class CartsManager {
  constructor() {
    this.path = "./src/data/files/carts.json";
    this.exists();
  }

  exists() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("File created");
    } else {
      console.log("File already exists");
    }
  }

  async readAll() {
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async readOne(id) {
    const all = await this.readAll();
    return all.find((each) => each.id === id);
  }

  async create(data = {}) {
    const all = await this.readAll();
    const newCart = {
      id: crypto.randomBytes(12).toString("hex"),
      products: [],
      ...data
    };
    all.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(all, null, 2));
    return newCart.id;
  }

  async destroy(id) {
    const all = await this.readAll();
    const filtered = all.filter((item) => item.id !== id);
    if (filtered.length === all.length) return null;
    await fs.promises.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return `Cart with id ${id} deleted`;
  }

  async addProduct(cid, pid, quantity) {
    const all = await this.readAll();
    const cartIndex = all.findIndex((cart) => cart.id === cid);
    if (cartIndex === -1) return null;

    const cart = all[cartIndex];

    const productIndex = cart.products.findIndex(
      (product) => product.pid === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ pid, quantity });
    }

    all[cartIndex] = cart;

    await fs.promises.writeFile(this.path, JSON.stringify(all, null, 2));
    return cart;
  }
}

const cartsManager = new CartsManager();
export default cartsManager;

