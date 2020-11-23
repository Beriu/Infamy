import {Message} from "discord.js";
import RepliesRepository from "../repositories/RepliesRepository";
import ReactionsRepository from "../repositories/ReactionsRepository";

export class CacheService {

    handle(msg: Message) {
        RepliesRepository.clearCache();
        ReactionsRepository.clearCache();
        return msg.reply('Cache cleared.')
    }
}

export default new CacheService();