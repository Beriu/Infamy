import Score, {ScoreDTO} from "../models/Score";
import database from "./database";
import {query, values} from "faunadb";
import {FaunaResponse} from "../models/FaunaResponse";
import Ref = values.Ref;

export class ScoresRepository {

    async getScores(): Promise<Array<Score>> {
        const scoresResponse = await database.query(
            query.Map(
                query.Paginate(query.Documents(query.Collection('scores'))),
                query.Lambda(x => query.Get(x))
            )
        ) as { data: Array<any> };
        return scoresResponse.data.map((v: any) => new Score(v.data));
    }

    async findScoreByUserId(id: string): Promise<FaunaResponse<Score>> {
        return await database.query(
            query.Get(
                query.Match(query.Index('scores_by_user_id'), id)
            )
        );
    }

    async updateScoreByReference(ref: Ref, data: Partial<Score>): Promise<FaunaResponse<Score>> {
        return await database.query(
            query.Update(ref, { data })
        );
    }

    async createScore(data: ScoreDTO): Promise<FaunaResponse<Score>> {
        return await database.query(
            query.Create(
                query.Collection('scores'),
                { data },
            )
        );
    }
}

export default new ScoresRepository();