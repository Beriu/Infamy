import Bot from "./app/Bot";

const bot = new Bot();

bot.start().catch(error => console.error(error));

