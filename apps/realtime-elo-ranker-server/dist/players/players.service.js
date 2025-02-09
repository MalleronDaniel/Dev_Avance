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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("../typeorm/entities/player.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
let PlayerService = class PlayerService {
    constructor(playerRepository, eventEmitter) {
        this.playerRepository = playerRepository;
        this.eventEmitter = eventEmitter;
    }
    findAll(callback) {
        this.playerRepository.find().then(players => {
            if (!players || players.length === 0) {
                return callback(new common_1.NotFoundException("Le classement n'est pas disponible car aucun joueur n'existe"));
            }
            callback(null, players);
        }).catch(err => callback(err));
    }
    findOne(id, callback) {
        this.playerRepository.findOneBy({ id }).then(player => callback(null, player)).catch(err => callback(err));
    }
    create(playerDTO, callback) {
        const player = new player_entity_1.Player();
        player.id = playerDTO.id;
        this.playerRepository.find().then(players => {
            if (player.id == undefined || !player.id.trim()) {
                return callback(new common_1.BadRequestException("L'identifiant du joueur n'est pas valide"));
            }
            if (players.find(p => p.id === player.id)) {
                return callback(new common_1.ConflictException('Le joueur existe déjà'));
            }
            const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
            const averageRank = players.length ? totalRank / players.length : 0;
            if (playerDTO.rank !== undefined && playerDTO.rank !== null) {
                player.rank = playerDTO.rank;
            }
            else if (players.length > 0) {
                player.rank = averageRank;
            }
            else {
                player.rank = 1000;
            }
            this.playerRepository.save(player).then(savedPlayer => { callback(null, savedPlayer); }).catch(err => callback(err));
            this.eventEmitter.emit('player.updated', player);
        }).catch(err => callback(err));
    }
    remove(id, callback) {
        this.playerRepository.delete(id).then(() => callback(null)).catch(err => callback(err));
    }
    updateRank(id, rank, callback) {
        this.playerRepository.findOneBy({ id }).then(player => {
            if (!player) {
                return callback(new common_1.BadRequestException('Joueur non trouvé'));
            }
            player.rank = rank;
            this.playerRepository.save(player).then(savedPlayer => callback(null, savedPlayer)).catch(err => callback(err));
            this.eventEmitter.emit('player.updated', player);
            console.log(player);
        }).catch(err => callback(err));
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], PlayerService);
//# sourceMappingURL=players.service.js.map