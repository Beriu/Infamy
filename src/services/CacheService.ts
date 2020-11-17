import {Message} from "discord.js";
import RepliesRepository from "../repositories/RepliesRepository";
import ReactionsRepository from "../repositories/ReactionsRepository";

export default class CacheService {

    static handle(msg: Message) {
        RepliesRepository.clearCache();
        ReactionsRepository.clearCache();
        return msg.reply('Cache cleared.')
    }
}