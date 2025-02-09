import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../typeorm/entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(Player)
        private playerRepository: Repository<Player>,
        private eventEmitter: EventEmitter2,
    ) {}

    findAll(callback: (err: any, players?: Player[]) => void): void {
        this.playerRepository.find().then(players => {
            if ( !players || players.length === 0) {
                return callback(new NotFoundException("Le classement n'est pas disponible car aucun joueur n'existe"));
            }
            callback(null, players);
        }).catch(err => callback(err));
    }

    findOne(id: string, callback: (err: any, player?: Player | null) => void): void {
        this.playerRepository.findOneBy({ id }).then(player => callback(null, player)).catch(err => callback(err));
    }

    create(playerDTO: CreatePlayerDto, callback: (err: any, player?: Player) => void) {
        const player = new Player();
        player.id = playerDTO.id;

        this.playerRepository.find().then(players => {
            if (player.id == undefined || !player.id.trim()) {
                return callback(new BadRequestException("L'identifiant du joueur n'est pas valide"));
            }
            if (players.find(p => p.id === player.id)) {
                return callback(new ConflictException('Le joueur existe déjà'));
            }
            const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
            const averageRank = players.length ? totalRank / players.length : 0;

            if (playerDTO.rank !== undefined && playerDTO.rank !== null) {
                player.rank = playerDTO.rank;
            } else if (players.length > 0) {
                player.rank = averageRank;
            } else {
                player.rank = 1000;
            }

            this.playerRepository.save(player).then(savedPlayer => 
                {callback(null, savedPlayer)}).catch(
                    err => callback(err)
                );
            this.eventEmitter.emit('player.updated', player);
        }).catch(err => callback(err));
    }

    remove(id: string, callback: (err: any) => void): void {
        this.playerRepository.delete(id).then(() => callback(null)).catch(err => callback(err));
    }

    updateRank(id: string, rank: number, callback: (err: any, player?: Player) => void): void {
        this.playerRepository.findOneBy({ id }).then(player => {
            if (!player) {
                return callback(new BadRequestException('Joueur non trouvé'));
            }
            player.rank = rank;
            this.playerRepository.save(player).then(savedPlayer => callback(null, savedPlayer)).catch(err => callback(err));
            this.eventEmitter.emit('player.updated', player);
            console.log(player);
        }).catch(err => callback(err));
    }

    
}