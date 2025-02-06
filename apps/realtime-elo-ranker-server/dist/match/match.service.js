"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("../players/players.service");
let MatchService = class MatchService {
    constructor(playerService) {
        this.playerService = playerService;
    }
    publish(matchDTO, callback) {
        this.playerService.findOne(matchDTO.winner, (err, winner) => {
            if (err || !winner)
                return callback(new Error(`Player ${matchDTO.winner} not found`));
            this.playerService.findOne(matchDTO.loser, (err, loser) => {
                if (err || !loser)
                    return callback(new Error(`Player ${matchDTO.loser} not found`));
                console.log(matchDTO.loser, "loser");
                console.log(loser, "bouh");
                [winner.rank, loser.rank] = this.calculateElo(winner.rank, loser.rank);
                Promise.all([
                    this.playerService.updateRank(winner.id, winner.rank, (err, player_winner) => {
                        if (err)
                            return callback(err);
                    }),
                    this.playerService.updateRank(loser.id, loser.rank, (err, player_loser) => {
                        if (err)
                            return callback(err);
                    }),
                ]).then(() => {
                    let res = {
                        winner: winner,
                        loser: loser,
                    };
                    callback(null, res);
                }).catch(err => callback(err));
            });
        });
    }
    calculateElo(winnerRank, loserRank) {
        const k = 32;
        const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserRank - winnerRank) / 400));
        const expectedScoreLoser = 1 / (1 + Math.pow(10, (winnerRank - loserRank) / 400));
        let newWinnerRank = Math.round(winnerRank + k * (1 - expectedScoreWinner));
        let newLoserRank = Math.round(loserRank + k * (0 - expectedScoreLoser));
        newWinnerRank = Math.max(0, newWinnerRank);
        newLoserRank = Math.max(0, newLoserRank);
        return [newWinnerRank, newLoserRank];
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [players_service_1.PlayerService])
], MatchService);
//# sourceMappingURL=match.service.js.map