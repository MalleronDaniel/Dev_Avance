import { PlayerService } from './players.service';
import { Player } from '../typeorm/entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayerController {
    private readonly playersService;
    constructor(playersService: PlayerService);
    findAll(callback: (err: any, players: Player[]) => void): void;
    findOne(id: string, callback: (err: any, player: Player | null) => void): void;
    create(playerDTO: CreatePlayerDto): Promise<Player>;
    remove(id: string, callback: (err: any) => void): void;
}
