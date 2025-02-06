import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [PlayersModule],
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}
