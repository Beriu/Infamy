export type ScoreDTO = {
    id: string,
    username: string,
    score: number,
};

export default class Score {

    id: string;
    username: string;
    score: number;

    constructor(dto: ScoreDTO) {
        this.id       = dto.id;
        this.score    = dto.score;
        this.username = dto.username;
    }
}