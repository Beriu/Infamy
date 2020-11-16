import database from "./database";
import {query} from "faunadb";
import Reaction from "../models/Reaction";

export default class ReactionsRepository {

    static reactions: Array<Reaction> = [];

    static async getReactions(): Promise<Array<Reaction>> {

        if(ReactionsRepository.reactions.length > 0) {
            return ReactionsRepository.reactions;
        }
        const reactionsResponse = await database.query(
            query.Map(
                query.Paginate(query.Documents(query.Collection('reactions'))),
                query.Lambda(x => query.Get(x))
            )
        ) as {data: Array<any>};
        const reactions = reactionsResponse.data.map((v: any) => new Reaction(v.data));
        ReactionsRepository.reactions = reactions;
        return reactions;
    }
}