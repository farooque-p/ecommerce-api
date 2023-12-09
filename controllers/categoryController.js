import { Category } from "../models/categoryModel.js";
import { Product } from "../models/productModel.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    //Validation
    if (!category) {
      return res
        .status(500)
        .json({ success: false, message: "Please Provide Category Name!" });
    }
    await Category.create({ category });

    res.status(201).json({
      success: true,
      message: "Category Created Successfully!",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Creating Category!",
      error,
    });
  }
};

//Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      success: true,
      message: "All Categories Fetched Successfully!",
      totalCat: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Getting All Categories!",
      error,
    });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category Not Found!" });
    }

    const products = await Product.find({ category: category._id });

    //Find Products with this Category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }

    // Delete Category
    await category.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Category Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    if (error.name === "CasteError") {
      res.status(500).json({ success: false, message: "Invalid Category ID!" });
    }
    res.status(500).json({
      success: false,
      message: "Error While Deleting Category!",
      error,
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category Not Found!" });
    }
    const { updatedCategory } = req.body;
    const products = await Product.find({ category: category._id });
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }

    if (updateCategory) {
      category.category = updatedCategory;
    }

    // Save Category
    await category.save();
    res
      .status(200)
      .json({ success: true, message: "Category Updated Successfully!" });
  } catch (error) {
    console.log(error);
    if (error.name === "CasteError") {
      return res
        .status(500)
        .json({ success: false, message: "Invalid Category ID!" });
    }
  }
};
