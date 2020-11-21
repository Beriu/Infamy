import {Client as DiscordClient, Message} from "discord.js";
import HelpService from "../services/HelpService";
import ReactService from "../services/ReactService";
import CacheService from "../services/CacheService";
import PointsService from "../services/PointsService";

export default class Bot {

    private client: DiscordClient;

    constructor() {
        this.client = new DiscordClient();
        this.client.on('ready', () => console.info('Discord bot running.'));
        this.client.on('message', this.messageRouter);
    }

    messageRouter(msg: Message) {
        if(msg.content.startsWith('$help')) {
            return HelpService.handle(msg);
        }
        if(msg.content.startsWith('$stats')) {
            return PointsService.getScores(msg);
        }
        if(msg.content.startsWith('$clear-cache')) {
            return CacheService.handle(msg);
        }
        if(msg.content.startsWith('$')) {
            return ReactService.handle(msg);
        }
    }

    start(): void {
        this.client
            .login(process.env.DISCORD_CLIENT_TOKEN)
            .catch(error => console.error(error));
    }
}