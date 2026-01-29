const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [OrderItemSchema], default: [] },
        total: { type: Number, required: true, min: 0 },
        promo: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
