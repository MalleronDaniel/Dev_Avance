import { MatchService } from './match.service';
import { MatchResultDTO, PublishMatchDto } from './dto/post-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    publish(matchDTO: PublishMatchDto): Promise<MatchResultDTO>;
}
