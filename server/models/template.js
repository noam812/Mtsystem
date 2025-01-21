import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: String,
  context: String,
  content: String,
});

const Template = mongoose.model("Template", templateSchema);

export default Template;
