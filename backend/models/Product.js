const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        category: { type: String, default: "Uncategorized" },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 },
        imageUrl: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
