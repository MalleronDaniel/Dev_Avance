import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { PlayersModule } from '../players/players.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PlayersModule, EventEmitterModule.forRoot()],
  providers: [RankService],
  controllers: [RankController],
  exports: [RankService],
})
export class RankModule {}
