import fs from "fs";
import crypto from "crypto";

class ProductsManager {
  constructor() {
    this.path = "./src/data/files/products.json";
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

  async readAll(category) {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const parsed = JSON.parse(data);
    return category
      ? parsed.filter((each) => each.category === category)
      : parsed;
  }

  async readOne(id) {
    const all = await this.readAll();
    return all.find((each) => each.id === id);
  }

  async create(data) {
    data.id = crypto.randomBytes(12).toString("hex");
    const all = await this.readAll();
    all.push(data);
    await fs.promises.writeFile(this.path, JSON.stringify(all, null, 2));
    return data.id;
  }

  async update(id, data) {
    const all = await this.readAll();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...data };
    await fs.promises.writeFile(this.path, JSON.stringify(all, null, 2));
    return all[index];
  }

  async destroy(id) {
    const all = await this.readAll();
    const filtered = all.filter((item) => item.id !== id);
    if (filtered.length === all.length) return null;
    await fs.promises.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return `Product with id ${id} deleted`;
  }
}

const productsManager = new ProductsManager();
export default productsManager;
