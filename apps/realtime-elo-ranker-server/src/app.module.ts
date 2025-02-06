import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { PlayerController } from './players/players.controller';
import { MatchModule } from './match/match.module';
import { RankModule } from './rank/rank.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PlayersModule,
    MatchModule,
    RankModule,
  ],
  controllers: [AppController, PlayerController],
  providers: [AppService],
})
export class AppModule {}
