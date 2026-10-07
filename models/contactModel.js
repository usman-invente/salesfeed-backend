import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      // Native Mongoose email regex check (secondary backup to Zod)
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email address"
      ]
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [150, "Subject cannot exceed 150 characters"],
      default: "General Inquiry"
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message cannot exceed 2000 characters"]
    },
    status: {
      type: String,
      enum: ["pending", "read", "resolved"],
      default: "pending"
    },
    attachment: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt
  }
);



const Contact = mongoose.model("Contact", contactSchema);

export default Contact;