import {Message, TextChannel} from "discord.js";
import codeText from "../utils/codeText";
import ReactionsRepository from "../repositories/ReactionsRepository";
import RepliesRepository from "../repositories/RepliesRepository";
import PointsService from "./PointsService";

type validationResponse = { passed: boolean, error: string };

export class CreateCommandService {

    commandFormatHelp = codeText(
        `$create reaction ±multiplier "replyText"\n\nex: $create palanga -2 "Mare palanga ce e si asta [username]"`
    );

    getReplyMessage(content: string) {
        const quotesRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        const dirtyResult = content.match(quotesRegex);
        if(dirtyResult) return dirtyResult[0].replace('\'', '').replace("\"", '');
        return dirtyResult;
    }

    validateInput(reaction: string, multiplier: string, reply: string | null): validationResponse {

        const parsedMultiplier = parseInt(multiplier);

        if(Number.isNaN(parsedMultiplier)) return { passed: false, error: 'Multiplier is not a number.' };
        if(!reaction) return { passed: false, error: 'Reaction text is not set.' };
        if(!parsedMultiplier) return { passed: false, error: 'Multiplier is not set.' };
        if(!reply) return { passed: false, error: 'Reply text is not set.' };

        if(reaction.length > 20) return { passed: false, error: 'Reaction text is too long, max is 20 characters.' };
        if(parsedMultiplier > 5 || parsedMultiplier < -5) return { passed: false, error: 'Multiplier is between -5 and 5 inclusive.' };

        return { passed: true, error: '' };
    }

    async handle(msg: Message) {
        const [cmd, reaction, multiplier] = msg.content.trim().split(' ');
        const reply = this.getReplyMessage(msg.content);

        const { passed, error } = this.validateInput(reaction, multiplier, reply);

        if(!passed) return msg.reply(error + '\n' + this.commandFormatHelp);
        const newReaction = await ReactionsRepository.createReaction(reaction, parseInt(multiplier));

        if(!newReaction) return msg.reply('Error occurred while creating reply.');
        const newReply = await RepliesRepository.createReply(newReaction.reactionId, reply as string);

        RepliesRepository.addReply(newReply);
        ReactionsRepository.addReaction(newReaction);

        const channel = msg.channel as TextChannel;
        return channel.send(`Created new reaction: ${newReaction.translation} \`${PointsService.calculate(newReaction.multiplier, newReaction.reactionType)}\``)
    }
}

export default new CreateCommandService();