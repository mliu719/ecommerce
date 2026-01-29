const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["customer", "owner"], default: "customer" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
