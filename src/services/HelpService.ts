import {Message} from 'discord.js';
import ReactionsRepository from "../repositories/ReactionsRepository";
import PointsService from "./PointsService";
import table from "../utils/table";

export class HelpService {

    async handle(msg: Message) {
        const commands = await this.getCommands();
        await msg.reply(table(commands, [ 'Reaction', 'Points' ]));
    }

    private async getCommands(): Promise<Array<Array<string>>> {
        let availableReactions = await ReactionsRepository.getReactions();
        return availableReactions.map(r =>
            [ r.translation, PointsService.calculate(r.multiplier, r.reactionType).toString() ]
        ).sort((a,b) => parseInt(a[1]) - parseInt(b[1]));
    }
}

export default new HelpService();