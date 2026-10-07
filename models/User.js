import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  termsAccepted: { type: Boolean, required: true },
});


// Pre-save middleware hook
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// generateAuthToken method
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: "7d" }
  );
};




const User = mongoose.model("User", userSchema);



export default User;
