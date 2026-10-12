import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    condition: {
      type: String,
      required: [true, "Product condition is required"],
      enum: ["New", "Like new", "Good", "Fair", "Poor"],
    },

    seller: {
      type: String,
      required: [true, "Seller name is required"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Product image URL is required"],
      trim: true,
    },

    imageAlt: {
      type: String,
      default: "",
      trim: true,
    },

    tone: {
      type: String,
      default: "sand",
      trim: true,
    },
  },
  {
    timestamps: true,
  },

);

const Product = mongoose.model("Product", productSchema);

export default Product;
