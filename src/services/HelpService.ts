import {Message} from 'discord.js';
import ReactionsRepository from "../repositories/ReactionsRepository";
import PointsService from "./PointsService";
import table from "../utils/table";

export default class HelpService {

    static async handle(msg: Message) {
        const commands = await HelpService.getCommands();
        await msg.reply(table(commands, [ 'Reaction', 'Points' ]));
    }

    private static async getCommands(): Promise<Array<Array<string>>> {
        let availableReactions = await ReactionsRepository.getReactions();
        return availableReactions.map(r =>
            [ r.translation, PointsService.calculate(r.multiplier, r.reactionType).toString() ]
        ).sort((a,b) => parseInt(a[1]) - parseInt(b[1]));
    }
}