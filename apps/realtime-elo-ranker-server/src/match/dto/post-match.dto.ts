import { PlayerDTO } from '../../players/dto/player.dto';

export class PublishMatchDto {
    readonly winner: string;
    readonly loser: string;
    readonly draw: boolean;
}

export class MatchResultDTO {
    readonly winner: PlayerDTO;
    readonly loser: PlayerDTO;
}