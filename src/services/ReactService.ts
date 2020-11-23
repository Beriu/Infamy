import {Message, TextChannel, User} from "discord.js";
import ReactionsRepository from "../repositories/ReactionsRepository";
import RepliesRepository from "../repositories/RepliesRepository";
import PointsService from "./PointsService";
import Reaction from "../models/Reaction";

export class ReactService {

    private static randomize(length: number) {
        return Math.floor((Math.random() * length));
    }

    async handle(msg: Message) {

        const channel = msg.channel as TextChannel;

        if(!channel) return msg.reply('Where the fuck did you send this message from ?');

        const reactions = await ReactionsRepository.getReactions();
        const validReactions = reactions.map(r => r.translation as string);
        const [command] = msg.content.replace('$', '').split(' ');

        if (validReactions.indexOf(command) === -1) {
            return await msg.reply(`\`$${command}\` is an invalid command, type \`$help\` to get a list of commands`);
        }
        const reaction = reactions.find(r => r.translation === command) as Reaction;
        const response = await this.processReaction(msg, reaction);

        return await channel.send(response);
    }

    private async processReaction(msg: Message, reaction: Reaction) {
        const from = msg.author.username;
        const to = msg.mentions.users.first();

        if (!to) return 'That\'s not valid user my dude.';
        if (to.username === from) return 'Self love is good, but don\'t overdue it.';

        const {score} = await PointsService.addScore(to, reaction);
        return await this.selectMessage(to, reaction, score);
    }

    private async selectMessage(to: User, reaction: Reaction, score: number) {
        const replyPool = await RepliesRepository.getRepliesById(reaction.reactionId);
        const index = ReactService.randomize(replyPool.length);

        const points = `\`${ PointsService.calculate(reaction.multiplier, reaction.reactionType) }\``;

        if(!replyPool[index]) {
            return `${points} <@${to.id}> ${reaction.translation}`;
        }

        return points + replyPool[index]
            .replace('[username]', `<@${to.id}>`)
            .replace('[score]', score.toString())
            .replace('[reaction]', reaction.translation);
    }
}

export default new ReactService();