import Product from '../models/productModel.js'; // Apne model ka path check kar lein

export const submitProductForm = async (req, res, next) => {
  try {
    // 1. Zod validated data aur req.body se fields destructure karein
    const { title, price, location, category, condition, seller, imageAlt, tone } = req.body;

    // Store a browser-accessible path instead of the machine-specific upload path.
    const imagePath = req.file ? `/uploads/images/${req.file.filename}` : null;

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

    req.io.emit('new-product-created', newProduct);

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: { id: newProduct._id },
    });
  } catch (err) {
    next(err); // Global error handler par error bhej dein
  }
};


export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Latest products pehle
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: products.map((product) => {
        const data = product.toObject();
        const imageFilename = data.image?.split(/[\\/]/).pop();
        return {
          ...data,
          image: imageFilename ? `/uploads/images/${imageFilename}` : "",
        };
      }),
    });
  } catch (err) {
    next(err);
  }
};
