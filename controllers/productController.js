import Product from '../models/productModel.js'; // Apne model ka path check kar lein

export const submitProductForm = async (req, res, next) => {
  try {
    // 1. Zod validated data aur req.body se fields destructure karein
    const { title, price, location, category, condition, seller, imageAlt, tone } = req.body;

    // 2. Multer se uploaded image ka path lein (e.g., "uploads/images/attachment-1234.jpg")
    const imagePath = req.file ? req.file.path : null;

    // 3. Database mein product create karein
    const newProduct = await Product.create({
      title,
      price,
      location,
      category,
      condition,
      seller,
      image: imagePath, // Yahan file path store hoga jo Mongoose schema maang raha hai
      imageAlt,
      tone,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: { id: newProduct._id },
    });
  } catch (err) {
    next(err); // Global error handler par error bhej dein
  }
};