import Template from "../models/template.js";

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    console.log("Templates fetched successfully!");
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTemplate = async (req, res) => {
  const template = new Template(req.body);
  try {
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
    console.log("Template created successfully!");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
