import { MatchResultDTO, PublishMatchDto } from './dto/post-match.dto';
import { PlayerService } from '../players/players.service';
export declare class MatchService {
    private playerService;
    constructor(playerService: PlayerService);
    publish(matchDTO: PublishMatchDto, callback: (err: any, result?: MatchResultDTO) => void): void;
    private calculateElo;
}
