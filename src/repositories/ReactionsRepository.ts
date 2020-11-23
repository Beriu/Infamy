import database from "./database";
import {query} from "faunadb";
import Reaction from "../models/Reaction";
import { v4 as uuid } from 'uuid';
import {FaunaResponse} from "../models/FaunaResponse";

export class ReactionsRepository {

    private reactions: Array<Reaction> = [];

    clearCache() {
        this.reactions = [];
    }

    addReaction(reaction: Reaction) {
        this.reactions.push(reaction);
    }

    async getReactions(): Promise<Array<Reaction>> {

        if(this.reactions.length > 0) {
            return this.reactions;
        }
        const reactionsResponse = await database.query(
            query.Map(
                query.Paginate(query.Documents(query.Collection('reactions'))),
                query.Lambda(x => query.Get(x))
            )
        ) as {data: Array<any>};
        const reactions = reactionsResponse.data.map((v: any) => new Reaction(v.data));
        this.reactions = reactions;
        return reactions;
    }

    async createReaction(translation: string, multiplier: number): Promise<Reaction> {

        //TODO: Deprecate the reaction_type attribute and just make multiplier have + or -
        const reactionType = multiplier > 0 ? 'positive' : 'negative';
        multiplier = multiplier > 0 ? multiplier : -multiplier;

        const reactionDto = { reaction_id: uuid(), multiplier, translation, reaction_type: reactionType };

        const reactionResponse = await database.query(
            query.Create(
                query.Collection('reactions'),
                { data: reactionDto },
            )
        ) as FaunaResponse<any>;
        return new Reaction(reactionResponse.data);
    }
}

export default new ReactionsRepository();