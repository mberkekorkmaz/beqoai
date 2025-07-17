require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');

// OpenAI yapılandırması
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Discord botu yapılandırması
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot aktif! ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!ai')) return;

  const userMessage = message.content.slice(3).trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // GPT-4o yerine bu model ücretsizdir
      messages: [
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;
    message.reply(reply);
  } catch (error) {
    console.error("Hata:", error);
    message.reply("Yapay zekada bir takılma oldu. (Muhtemelen API kredisi yok ya da model engellendi.)");
  }
});

client.login(process.env.DISCORD_TOKEN);
