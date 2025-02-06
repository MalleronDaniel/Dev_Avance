"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankModule = void 0;
const common_1 = require("@nestjs/common");
const rank_service_1 = require("./rank.service");
const rank_controller_1 = require("./rank.controller");
const players_module_1 = require("../players/players.module");
const event_emitter_1 = require("@nestjs/event-emitter");
let RankModule = class RankModule {
};
exports.RankModule = RankModule;
exports.RankModule = RankModule = __decorate([
    (0, common_1.Module)({
        imports: [players_module_1.PlayersModule, event_emitter_1.EventEmitterModule.forRoot()],
        providers: [rank_service_1.RankService],
        controllers: [rank_controller_1.RankController],
        exports: [rank_service_1.RankService],
    })
], RankModule);
//# sourceMappingURL=rank.module.js.map