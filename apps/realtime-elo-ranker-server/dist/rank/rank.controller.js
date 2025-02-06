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
exports.RankController = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("../players/players.service");
const rxjs_1 = require("rxjs");
const event_emitter_1 = require("@nestjs/event-emitter");
let RankController = class RankController {
    constructor(playerService, eventEmitter) {
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
    }
    sse() {
        console.log('Catch SSE');
        return (0, rxjs_1.fromEvent)(this.eventEmitter, 'player.updated').pipe((0, rxjs_1.map)((player) => ({
            data: {
                type: 'RankingUpdate',
                player: {
                    id: player.id,
                    rank: player.rank,
                },
            },
        })));
    }
    async ranking() {
        return new Promise((resolve, reject) => {
            this.playerService.findAll((err, players) => {
                if (err) {
                    if (err instanceof common_1.BadRequestException) {
                        reject({ "code": 404, "message": err.message });
                    }
                    reject(err);
                }
                else {
                    resolve(players.sort((a, b) => b.rank - a.rank));
                }
            });
        });
    }
};
exports.RankController = RankController;
__decorate([
    (0, common_1.Sse)('/events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], RankController.prototype, "sse", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankController.prototype, "ranking", null);
exports.RankController = RankController = __decorate([
    (0, common_1.Controller)('api/ranking'),
    __metadata("design:paramtypes", [players_service_1.PlayerService,
        event_emitter_1.EventEmitter2])
], RankController);
//# sourceMappingURL=rank.controller.js.map