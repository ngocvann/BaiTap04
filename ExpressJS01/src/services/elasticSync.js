const Product = require("../models/product");
const client = require("../config/elastic");

async function syncProducts() {
  const products = await Product.findAll({ raw: true });

  for (const p of products) {
    await client.index({
      index: "products",
      id: p.id,
      document: p,
    });
  }

  await client.indices.refresh({ index: "products" });

  console.log("Synced all products to Elasticsearch");
}

syncProducts();
