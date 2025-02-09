import { Controller, Get, Post, Delete, Param, Body, BadRequestException, ConflictException } from '@nestjs/common';
import { PlayerService } from './players.service';
import { Player } from '../typeorm/entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('api/player')
export class PlayerController {
    constructor(private readonly playersService: PlayerService) {}

    @Get()
    findAll(callback: (err: any, players: Player[]) => void): void {
        this.playersService.findAll(callback);
    }

    @Get(':id')
    findOne(@Param('id') id: string, callback: (err: any, player: Player | null) => void): void {
        this.playersService.findOne(id, callback);
    }

    @Post()
    create(@Body() playerDTO: CreatePlayerDto): Promise<Player> {
        return new Promise((resolve, reject) => {
            this.playersService.create(playerDTO, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ id: result!.id, rank: result!.rank });
            });
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string, callback: (err: any) => void): void {
        this.playersService.remove(id, callback);
    }
}
