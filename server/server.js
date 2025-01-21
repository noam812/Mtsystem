require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors"); // Import cors
// import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Schema
const templateSchema = new mongoose.Schema({
  name: String,
  context: String,
  content: String,
});
const Template = mongoose.model("Template", templateSchema);

// // OpenAI setup

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Telegram Bot Commands
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to the Template Bot!");
});

bot.onText(/\/templates/, async (msg) => {
  try {
    const templates = await Template.find();
    if (templates.length === 0) {
      return bot.sendMessage(msg.chat.id, "No templates found.");
    }
    const templateList = templates
      .map((t) => `- ${t.name}: ${t.content}`)
      .join("\n");
    bot.sendMessage(msg.chat.id, "Available Templates:\n" + templateList);
  } catch (error) {
    console.error("Error fetching templates:", error);
    bot.sendMessage(msg.chat.id, "Error fetching templates.");
  }
});

// bot.on("message", async (msg) => {
//   if (msg.text && !msg.text.startsWith("/")) {
//     // Only process regular messages
//     try {
//       const templatesData = await Template.find({}, "context _id");
//       const contextMap = templatesData.reduce((map, t) => {
//         map[t.context] = t._id;
//         return map;
//       }, {});
//       if (templates.length > 0) {
//         const prompt = `User message: ${
//           msg.text
//         }\nFind the most relevant template context:\n${contextMap
//           .keys()
//           .join(
//             "\n"
//           )}\nReturn only the most relevant context or "No match" if none is found.`;

//         const completion = await openai.createCompletion({
//           model: "text-davinci-003",
//           prompt: prompt,
//           max_tokens: 50,
//         });
//         const matchedContext = completion.data.choices[0].text.trim();

//         if (matchedContext !== "No match" && contextMap[matchedContext]) {
//           const matchedTemplate = templates.find(
//             contextMap[matchedContext].get("_id")
//           );
//           bot.sendMessage(msg.chat.id, matchedTemplate.content);
//         } else {
//           bot.sendMessage(msg.chat.id, "No matching template found.");
//         }
//       } else {
//         bot.sendMessage(msg.chat.id, "No templates available to match.");
//       }
//     } catch (error) {
//       console.error("OpenAI or template processing error:", error);
//       bot.sendMessage(msg.chat.id, "An error occurred.");
//     }
//   }
// });

// API Routes
app.get("/api/templates", async (req, res) => {
  try {
    const templates = await Template.find();
    console.log("Templates fetched successfully!");
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/templates", async (req, res) => {
  const template = new Template(req.body);
  try {
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
    console.log("Template created successfully!");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/templates/:id", async (req, res) => {
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
});

app.delete("/api/templates/:id", async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
