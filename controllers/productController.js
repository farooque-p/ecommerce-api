import { Product } from "../models/productModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

// Create Product

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock } = req.body;
    /*     if (!name || !description || !price || !stock) {
      return res
        .status(200)
        .json({ success: false, message: "All Fields are Mandatory!" });
    } */

    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Product Images",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error Creating Product!", error });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    console.log("Keyword:", keyword);
    console.log("Category:", category);

    const products = await Product.find({
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
      // category: category ? category : null,
    }).populate(category);
    res.status(200).json({
      success: true,
      message: "All Products are Fetched!",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error Getting All Products", error });
  }
};

// Get Top Products
export const getTopProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    return res
      .status(200)
      .json({
        success: true,
        message: "Top 3 Products Fetched Successfully!",
        products,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Getting Top Products!",
      error,
    });
  }
};

// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    //Validation
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found!" });
    }

    res.status(200).json({
      success: true,
      message: "Product Fetched Successfully!",
      product,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res
        .status(500)
        .json({ success: false, message: "Invalid Product ID!" });
    }
    res.status(500).json({
      success: false,
      message: "Error Getting Single Product!",
      error,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    //Validation
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found!" });
    }

    const { name, description, price, stock, category } = req.body;

    //Validation & Update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    //Save Product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch {
    console.log(error);
    if (error.name === "CasteError") {
      return res
        .status(500)
        .json({ success: false, message: "Invalid Product ID!" });
    }
    res
      .stauts(500)
      .json({ success: false, message: "Error While Updating Product", error });
  }
};

// Update Product Image
export const updateProductImage = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    //Validation
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found!" });
    }

    // Check File
    if (!req.file) {
      return res
        .status(404)
        .json({ success: false, message: "Product Image Not Found!" });
    }

    const file = getDataUri(req.file);

    const cdb = await cloudinary.v2.uploader.upload(file.content);

    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    product.images.push(image);

    //Save Product
    await product.save();

    res
      .status(200)
      .json({ success: true, message: "Product Image Updated Successfully!" });
  } catch {
    console.log(error);
    if ((error.name = "CastError")) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid Product ID!" });
    }
    res.status(500).json({
      success: false,
      message: "Error While Updating Product Image!",
      error,
    });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    //Validation
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found!" });
    }

    //Find Image ID
    const imageId = req.query.id;
    if (!imageId) {
      return res
        .status(404)
        .json({ success: false, message: "Product Image Not Found!" });
    }

    // Check if image exists
    let isImageExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === imageId.toString()) {
        isImageExist = index;
      }
    });

    // Validation
    if (isImageExist < 0) {
      return res
        .status(404)
        .json({ success: false, message: "Image Not Found!" });
    }

    // Delete Product Image
    await cloudinary.v2.uploader.destroy(
      product.images[isImageExist].public_id
    );
    product.images.splice(isImageExist, 1);
    await product.save();
    res
      .status(200)
      .json({ success: false, message: "Product Image Deleted Successfully!" });
  } catch {
    console.log(error);
    if (error.name === "CasteError") {
      return res
        .status(500)
        .json({ success: false, message: "Invalid Product Image ID!" });
    }
    res
      .status(500)
      .json({ success: false, message: "Error Deleting Product Image", error });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    // Find Product
    const productId = req.params.id;
    const product = await Product.findById(productId);
    // Validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Not Found!",
      });
    }
    // Find and Delete Images from cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully!",
    });
  } catch (error) {
    console.log(error);
    // Cast Error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Product ID",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error While Deleting Product",
      error,
    });
  }
};

// Review Product
export const reviewProduct = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    //Find product
    const product = await Product.findById(req.params.id);

    //Validation
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found!" });
    }

    //Check if product is already been reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    //Validation
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "Product is Already Been Reviewed!" });
    }

    //Review product
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
      user: req.user._id,
    };

    // Add review to reviews array
    product.reviews.push(review);

    // Number of reviews
    product.numReviews = product.reviews.length;

    // Rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Save product
    await product.save();
    res
      .status(200)
      .json({ success: true, message: "Product Review Added Successfully!" });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res
        .status(500)
        .json({ success: false, message: "Invalid Product ID!", error });
    }
    res.status(500).json({
      success: false,
      message: "Error While Reviewing Product!",
      error,
    });
  }
};
