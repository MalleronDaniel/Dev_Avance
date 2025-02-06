import { BadRequestException, Controller, Get, Inject, Sse } from '@nestjs/common';
import { PlayerService } from '../players/players.service';
import { Player } from '../typeorm/entities/player.entity' 
import { fromEvent, map, Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Controller('api/ranking')
export class RankController {
    constructor(
        private readonly playerService: PlayerService,
        private eventEmitter: EventEmitter2,
    ) {}

    @Sse('/events')
    sse(): Observable<MessageEvent> {
        console.log('Catch SSE');
        return fromEvent(this.eventEmitter, 'player.updated').pipe(
            map((player: Player) => ({
                data: {
                    type: 'RankingUpdate',
                    player: {
                        id: player.id,
                        rank: player.rank,
                    },
                },
            }) as MessageEvent),
        );
    }

    @Get()
    async ranking(): Promise<Player[]> {
        return new Promise((resolve, reject) => {
            this.playerService.findAll((err, players) => {
                if (err) {
                    if(err instanceof BadRequestException) {
                        reject({"code":404 , "message": err.message});
                    }
                    reject(err);
                } else {
                    resolve(players!.sort((a, b) => b.rank - a.rank));
                }
            });
        }
    
    )}
}
