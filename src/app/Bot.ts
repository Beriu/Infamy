import {Client as DiscordClient, Message} from "discord.js";
import HelpService from "../services/HelpService";
import ReactService from "../services/ReactService";

export default class Bot {

    private client: DiscordClient;

    constructor() {
        this.client   = new DiscordClient();
        this.client.on('ready', () => console.info('Discord bot running.'));
        this.client.on('message', this.messageRouter);
    }

    async messageRouter(msg: Message) {
        if(msg.content.startsWith('$help')) {
           return await HelpService.handle(msg);
        }
        if(msg.content.startsWith('$')) {
            return await ReactService.handle(msg);
        }
    }

    async start() {
        return this.client.login(process.env.DISCORD_CLIENT_TOKEN);
    }
}