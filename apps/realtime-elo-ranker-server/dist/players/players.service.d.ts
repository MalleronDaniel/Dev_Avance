import { Repository } from 'typeorm';
import { Player } from '../typeorm/entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PlayerService {
    private playerRepository;
    private eventEmitter;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    findAll(callback: (err: any, players?: Player[]) => void): void;
    findOne(id: string, callback: (err: any, player?: Player | null) => void): void;
    create(playerDTO: CreatePlayerDto, callback: (err: any, player?: Player) => void): void;
    remove(id: string, callback: (err: any) => void): void;
    updateRank(id: string, rank: number, callback: (err: any, player?: Player) => void): void;
}
