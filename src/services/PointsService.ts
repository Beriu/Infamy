import Reaction from "../models/Reaction";
import {Message, TextChannel, User} from "discord.js";
import Score from "../models/Score";
import ScoresRepository from "../repositories/ScoresRepository";
import table from "../utils/table";

export default class PointsService {

    static calculate(multiplier: number, modifierText: string) {
        const modifier = modifierText === 'negative' ? -1 : 1;
        return modifier * multiplier * 10;
    }

    static async addScore(target: User, reaction: Reaction): Promise<Score> {
        const points = PointsService.calculate(reaction.multiplier, reaction.reactionType);
        try {
            let score = await ScoresRepository.findScoreByUserId(target.id);
            score = await ScoresRepository.updateScoreByReference(score.ref, { score: score.data.score + points });
            return new Score(score.data);
        }catch (notFoundError) {
            let score = await ScoresRepository.createScore({ id: target.id, username: target.username, score: points });
            return new Score(score.data);
        }
    }

    static async getScores(msg: Message) {
        const channel = msg.channel as TextChannel;
        const scores = await ScoresRepository.getScores();
        let formattedScores = scores
            .map(s => [ s.username, s.score.toString() ])
            .sort((a,b) => parseInt(a[1]) - parseInt(b[1]));
        return await channel.send(table(formattedScores, [ 'Username', 'Score' ]));
    }
}