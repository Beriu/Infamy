import database from "./database";
import {query} from "faunadb";
import {FaunaResponse} from "../models/FaunaResponse";

export type replyDTO = {
    reaction_id: string,
    message: string
};

export type reply = {
    reactionId: string,
    message: string
};

export class RepliesRepository {

    private replies: reply[] = [];

    clearCache() {
        this.replies = [];
    }

    addReply(reply: reply) {
        this.replies.push(reply);
    }

    async getReplies(): Promise<Array<reply>> {

        if(this.replies.length > 0) {
            return this.replies;
        }

        const repliesResponse = await database.query(
            query.Map(
                query.Paginate(query.Documents(query.Collection('replies'))),
                query.Lambda(x => query.Get(x))
            )
        ) as FaunaResponse<Array<FaunaResponse<replyDTO>>>;
        const replies = repliesResponse.data.map(r => {
            const dto = r.data;
            return { reactionId: dto.reaction_id, message: dto.message };
        });
        this.replies = replies;
        return replies;
    }

    async getRepliesById(id: string): Promise<Array<string>> {
        const replies = await this.getReplies();
        return replies.filter(r => r.reactionId === id).map(r => r.message);
    }

    async createReply(reactionId: string, message: string): Promise<reply> {
        const { data } = await database.query(
            query.Create(
                query.Collection('replies'),
                { data: { reaction_id: reactionId, message } },
            )
        ) as FaunaResponse<any>;
        const reply = { reactionId: data.reaction_id, message: data.message };
        this.replies.push(reply);
        return reply;
    }
}

export default new RepliesRepository();