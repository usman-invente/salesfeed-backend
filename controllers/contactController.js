import Contact from "../models/contactModel.js";

export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Get the uploaded PDF file path/URL from Multer if present
    const attachmentPath = req.file ? req.file.path : null;

    // 2. Create the document including the attachment path
    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
      attachment: attachmentPath // Stores file path like "uploads/pdf/doc-1234.pdf"
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been received. We will get back to you shortly.",
      data: { id: newContact._id }
    });
  } catch (err) {
    next(err); // Delegates error directly to middleware/errorHandler.js
  }
};