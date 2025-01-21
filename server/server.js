import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import TelegramBot from "node-telegram-bot-api";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Schema
const templateSchema = new mongoose.Schema({
  name: String,
  context: String,
  content: String,
});
const Template = mongoose.model("Template", templateSchema);

// // OpenAI setup

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

bot.on("message", async (msg) => {
  if (msg.text && !msg.text.startsWith("/")) {
    // Only process regular messages
    try {
        const templatesData = await Template.find({}, "context _id");
        console.log(templatesData);
      const contextMap = new Map(templatesData.map((t) => [t.context, t._id]));
      console.log(Array.from(contextMap.keys()).join(", "));
      if (templatesData.length > 0 && contextMap.size > 0) {
        const prompt = `User message: ${
          msg.text
        }\nFind the most relevant template context: ${Array.from(
          contextMap.keys()
        ).join(
          ", "
        )} Return only the most relevant context or "No match" if none is found.`;

        console.log(prompt);

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 50,
        });

        const matchedContext = completion.choices[0].message.content.trim();
        console.log(`match ${matchedContext}`);
        console.log(contextMap.has(matchedContext));  

        if (matchedContext !== "No match" && contextMap.has(matchedContext.toLowerCase())) {
          const matchedTemplate = await Template.findById(
            contextMap.get(matchedContext)
          );
          bot.sendMessage(msg.chat.id, matchedTemplate.content);
        } else {
          bot.sendMessage(msg.chat.id, "No matching template found.");
        }
      } else {
        bot.sendMessage(msg.chat.id, "No templates available to match.");
      }
    } catch (error) {
      console.error("OpenAI or template processing error:", error);
      bot.sendMessage(msg.chat.id, "An error occurred.");
    }
  }
});

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

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

startServer();
