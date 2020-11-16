import {Message} from "discord.js";
import ReactionsRepository from "../repositories/ReactionsRepository";
import PointsService from "./PointsService";
import Reaction from "../models/Reaction";

export default class ReactService {

    static async handle(msg: Message) {
        const reactions = await ReactionsRepository.getReactions();
        const validReactions = reactions.map(r => r.translation as string);
        const [command] = msg.content.replace('$', '').split(' ');

        if(validReactions.indexOf(command) === -1) {
            return await msg.reply(`\`$${command}\` is an invalid command, type \`$help\` to get a list of commands`);
        }
        const reaction = reactions.find(r => r.translation === command) as Reaction;
        const response = await ReactService.processReaction(msg, reaction);

        return await msg.reply(`${response}`);
    }

    private static async processReaction(msg: Message, reaction: Reaction) {
        const from = msg.author.username;
        const to = msg.mentions.users.first();

        if(!to) return 'That\'s not valid user my dude.';
        if(to.username === from) return 'Self love is good, but don\'t overdue it.';

        const score = await PointsService.addScore(to, reaction);

        return `thinks ${to.username} is kinda ${reaction.translation}. (${score.score})`;
    }
}