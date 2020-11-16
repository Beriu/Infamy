export type ReactionDTO = {
    translation: string;
    reaction_id: string;
    reaction_type: string;
    multiplier: number;
}

export default class Reaction {

    public translation: string;
    public reactionId: string;
    public reactionType: string;
    public multiplier: number;

    constructor(dto: ReactionDTO) {
        this.translation  = dto.translation;
        this.reactionId   = dto.reaction_id;
        this.reactionType = dto.reaction_type;
        this.multiplier   = dto.multiplier;
    }
}