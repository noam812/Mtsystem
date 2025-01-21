import dotenv from "dotenv";
import Template from "../models/template.js";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handleStartCommand = (bot, msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to the Template Bot!");
};

export const handleTemplatesCommand = async (bot, msg) => {
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
};

export const handleMessage = async (bot, msg) => {
  if (msg.text && !msg.text.startsWith("/")) {
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

        if (
          matchedContext !== "No match" &&
          contextMap.has(matchedContext.toLowerCase())
        ) {
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
};
