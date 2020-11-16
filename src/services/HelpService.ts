import {Message} from 'discord.js';
import ReactionsRepository from "../repositories/ReactionsRepository";
import PointsService from "./PointsService";

export default class HelpService {

    static async handle(msg: Message) {
        const help = await HelpService.getHelp();
        await msg.reply(help);
    }

    private static async getHelp(): Promise<string> {
        let availableReactions = await ReactionsRepository.getReactions();
        const helpString = availableReactions.reduce<string>((pool, cur) => {
            if (!cur.multiplier || !cur.reactionType) return '';
            pool += `${cur.translation}: ${PointsService.calculate(cur.multiplier, cur.reactionType)} \n`;
            return pool;
        }, '');
        return `Hi! \n >>> ${helpString}`;
    }
}