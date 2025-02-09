import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { MatchResultDTO, PublishMatchDto } from './dto/post-match.dto';
import { PlayerService } from '../players/players.service';
import { Player } from '../typeorm/entities/player.entity';

@Injectable()
export class MatchService {
    constructor(private playerService: PlayerService) {}

    publish(matchDTO: PublishMatchDto, callback: (err: any, result?: MatchResultDTO) => void): void {
        // Récupérer le gagnant
        this.playerService.findOne(matchDTO.winner, (err, winner) => {
            if (err || !winner) return callback(new UnprocessableEntityException(`Player ${matchDTO.winner} not found`));

            // Récupérer le perdant
            
            this.playerService.findOne(matchDTO.loser, (err, loser) => {
                if (err || !loser) return callback(new UnprocessableEntityException(`Player ${matchDTO.loser} not found`));

                // Calcul du nouveau classement ELO
                console.log(matchDTO.loser, "loser");
                console.log(loser, "bouh");
                [winner.rank, loser.rank] = this.calculateElo(winner.rank!, loser.rank!);

                // Mettre à jour les rangs
                Promise.all([
                    this.playerService.updateRank(winner.id, winner.rank, (err, player_winner) => {
                        if (err) return callback(new UnprocessableEntityException(err.message));
                    }),
                    this.playerService.updateRank(loser.id, loser.rank, (err, player_loser) => {
                        if (err) return callback(new UnprocessableEntityException(err.message));
                    }),
                ]).then(() => {
                    let res  = {
                        winner: winner,
                        loser: loser,
                    }
                    callback(null, res);
                }).catch(err => callback(err));
            });
        });
    }

    private calculateElo(winnerRank: number, loserRank: number): [number, number] {
        const k = 32;
        const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserRank - winnerRank) / 400));
        const expectedScoreLoser = 1 / (1 + Math.pow(10, (winnerRank - loserRank) / 400));

        let newWinnerRank = Math.round(winnerRank + k * (1 - expectedScoreWinner));
        let newLoserRank = Math.round(loserRank + k * (0 - expectedScoreLoser));

        newWinnerRank = Math.max(0, newWinnerRank);
        newLoserRank = Math.max(0, newLoserRank);

        return [newWinnerRank, newLoserRank];
    }
}
