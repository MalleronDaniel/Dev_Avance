import { Module } from '@nestjs/common';
import { PlayerService } from './players.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../typeorm/entities/player.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayersModule {}
