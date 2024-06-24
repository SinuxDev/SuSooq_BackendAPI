const faker = require("faker");
const mongoose = require("mongoose");

const sellerId = "66758a09734b4b31e8c1359e";

function generateFakeProductData() {
  const cutsomCategories = [
    "electronics",
    "fashion",
    "home_garden",
    "health_beauty",
    "sports_outdoors",
    "toys_hobbies",
    "automotive",
    "books_media",
    "collectibles_art",
    "food_beverages",
  ];

  return {
    name: faker.commerce.productName().slice(0, 10),
    description: faker.commerce.productDescription().slice(0, 20),
    price: faker.commerce.price(),
    category: faker.random.arrayElement(cutsomCategories),
    usedFor: faker.lorem.words(3),
    status_details: {
      negotiable: faker.datatype.boolean(),
      warranty: faker.datatype.boolean(),
      free_delivery: faker.datatype.boolean(),
      cash_on_delivery: faker.datatype.boolean(),
      limited_stock: faker.datatype.boolean(),
    },
    status: faker.random.arrayElement(["pending", "rejected", "approved"]),
    seller: { $oid: new mongoose.Types.ObjectId(sellerId) },
    createdAt: { $date: new Date().toISOString() },
    updatedAt: { $date: new Date().toISOString() },
  };
}

const numberOfProducts = 20;

for (let i = 0; i <= numberOfProducts; i++) {
  const product = generateFakeProductData();
  console.log(JSON.stringify(product, null, 2));
}
