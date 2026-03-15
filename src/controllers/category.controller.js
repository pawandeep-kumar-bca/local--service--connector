const categoryModel = require("../models/category.model");

async function createCategory(req, res) {
  try {
    const { name, description, icon, status } = req.body;
    if (!name) {
      return res.status(400).json({ message: "category name is required" });
    }
    const categoryNameExists = await categoryModel.findOne({ name });

    if (categoryNameExists) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const category = await categoryModel.create({
      name,
      description,
      icon,
      status: status || "Active",
    });
    return res
      .status(201)
      .json({
        message: "category created successfully",
        name: category.name,
        description: category.description,
        icon: category.icon,
        status: category.status,
      });
  } catch (err) {
    console.error("Category create error:", err);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getCategory(req, res) {
  try {
    const categories = await categoryModel.find().lean();
    if (categories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No categories found",
        categories: []
      });
    }
    return res.status(200).json({
      message: "categories fetch successfully",
      categories,
    });
  } catch (err) {
    console.error("getCategory error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}



async function updateCategory(req, res) {
  try {
    const { name, description, icon, status } = req.body;
    const { id } = req.params;

    // check category exist
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // duplicate name check (ignore same category)
    if (name) {
      const categoryNameExists = await categoryModel.findOne({ name });

      if (categoryNameExists && categoryNameExists._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Category name already exists",
        });
      }
    }

    // update fields
    if (name) category.name = name;
    if (description) category.description = description;
    if (icon) category.icon = icon;
    if (status) category.status = status;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });

  } catch (err) {
    console.error("update category error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // check category exists
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // dependency check (services using this category)
    const serviceExists = await serviceModel.findOne({ categoryId: id });

    if (serviceExists) {
      return res.status(409).json({
        success: false,
        message: "Category cannot be deleted because services are using this category"
      });
    }

    // delete category
    await categoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (err) {
    console.error("delete category error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
};
