import { PlayerService } from '../players/players.service';
import { Player } from '../typeorm/entities/player.entity';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class RankController {
    private readonly playerService;
    private eventEmitter;
    constructor(playerService: PlayerService, eventEmitter: EventEmitter2);
    sse(): Observable<MessageEvent>;
    ranking(): Promise<Player[]>;
}
