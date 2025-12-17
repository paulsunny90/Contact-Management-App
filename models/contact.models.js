import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    countrycode: { type: Number, required: true },
    phnumber: { type: Number, required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
