import mongoose from "mongoose";

// Review Model
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is require!"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required!"],
    },
  },
  { timestamps: true }
);

// Product Model
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is Mandatory!"],
    },
    description: {
      type: String,
      required: [true, "Produvct Description is Mandatory!"],
    },
    price: {
      type: Number,
      required: [true, "Product Price is Mandatory!"],
    },
    stock: {
      type: Number,
      required: [true, "Product Stock is Mandatory!"],
    },
    // quantity: {
    //   type: Number,
    //   required: [true, "product quantity required"],
    // },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const Product = mongoose.model("Product", productSchema);
