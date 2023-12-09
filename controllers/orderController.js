import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { stripe } from "../server.js";

//Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    //Validation

    //Create Order
    await Order.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // Update Stock
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await Product.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully!",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error While Creating Order!", error });
  }
};

// Get All Orders - User
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "No Order Found!" });
    }
    res.status(200).json({
      success: true,
      message: "Your Orders!",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Getting Your Orders!",
      error,
    });
  }
};

// Get Single Order
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    //Validation
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order Fetched Successfully!", order });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status({ success: false, message: "Invalid Order ID!" });
    }
    res
      .status(500)
      .json({ success: false, message: "Error While Getting Order!", error });
  }
};

// Get Payment
export const getPayment = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    //Validation
    if (!totalAmount) {
      return res
        .status(404)
        .json({ success: false, message: "Total Amount is Required!" });
    }

    // Accept Payment
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Accepting Payment!",
      error,
    });
  }
};

//================ Admin Section ================

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({
      success: true,
      message: "All Orders Fetched Succesfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Getting All Orders!",
      error,
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    //Find Order
    const order = await Order.findById(req.params.id);

    //Validation
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found!" });
    }

    // Update Order Status
    if (order.orderStatus === "Processing") {
      order.orderStatus = "Shipped";
    } else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Delivered";
      order.deliverdAt = Date.now();
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Order Already Delivered!" });
    }

    // Save Order
    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order Stauts Updated Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Upating Order Status!",
      error,
    });
  }
};
