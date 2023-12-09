import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Address is required!"],
      },
      city: {
        type: String,
        required: [true, "City name is required!"],
      },
      country: {
        type: String,
        required: [true, "Country name is required!"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product name is required!"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required!"],
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required!"],
        },
        image: {
          type: String,
          required: [true, "Product image is required!"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user id is required!"],
    },
    paidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "Item price is required!"],
    },
    tax: {
      type: Number,
      required: [true, "Tax price is require"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "Item Shipping Charges  is required!"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Item Total Amount price is required!"],
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    deliverdAt: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
