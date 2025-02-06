import { PlayerDTO } from '../../players/dto/player.dto';
export declare class PublishMatchDto {
    readonly winner: string;
    readonly loser: string;
    readonly draw: boolean;
}
export declare class MatchResultDTO {
    readonly winner: PlayerDTO;
    readonly loser: PlayerDTO;
}
