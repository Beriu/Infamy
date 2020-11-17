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

export default class RepliesRepository {

    private static replies: reply[] = [];

    static clearCache() {
        RepliesRepository.replies = [];
    }

    static async getReplies(): Promise<Array<reply>> {

        if(RepliesRepository.replies.length > 0) {
            return RepliesRepository.replies;
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
        RepliesRepository.replies = replies;
        return replies;
    }

    static async getRepliesById(id: string): Promise<Array<string>> {
        const replies = await RepliesRepository.getReplies();
        return replies.filter(r => r.reactionId === id).map(r => r.message);
    }
}