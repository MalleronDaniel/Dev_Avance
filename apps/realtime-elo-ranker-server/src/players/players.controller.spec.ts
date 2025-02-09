import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';
import { Player } from '../typeorm/entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('PlayerController', () => {
    let controller: PlayerController;
    let playerService: PlayerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlayerController],
            providers: [
                {
                    provide: PlayerService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<PlayerController>(PlayerController);
        playerService = module.get<PlayerService>(PlayerService);
    });

    describe('GET /api/player', () => {
        it('doit retourner une liste de joueurs', (done) => {
            const mockPlayers: Player[] = [
                { id: "1", rank: 5 } as Player,
                { id: "2", rank: 10 } as Player,
            ];

            (playerService.findAll as jest.Mock).mockImplementation((callback) => {
                callback(null, mockPlayers);
            });

            controller.findAll((err, players) => {
                expect(players).toEqual(mockPlayers);
                done();
            });
        });
    });

    describe('GET /api/player/:id', () => {
        it('doit retourner un joueur spécifique', (done) => {
            const mockPlayer: Player = { id: "1", rank: 5 } as Player;

            (playerService.findOne as jest.Mock).mockImplementation((id, callback) => {
                callback(null, mockPlayer);
            });

            controller.findOne('1', (err, player) => {
                expect(player).toEqual(mockPlayer);
                done();
            });
        });

        it("doit retourner null si le joueur n'existe pas", (done) => {
            (playerService.findOne as jest.Mock).mockImplementation((id, callback) => {
                callback(null, null);
            });

            controller.findOne('999', (err, player) => {
                expect(player).toBeNull();
                done();
            });
        });
    });

    describe('POST /api/player', () => {
        it('doit créer un joueur et retourner son ID et son rang', async () => {
            const dto: CreatePlayerDto = { id: 'John Doe', rank: 5 };
            const mockPlayer: Player = { id: "1", rank: 5 } as Player;

            (playerService.create as jest.Mock).mockImplementation((data, callback) => {
                callback(null, mockPlayer);
            });

            const result = await controller.create(dto);
            expect(result).toEqual({ id: '1', rank: 5 });
        });

        it("doit retourner une erreur 400 si c'est une mauvaise requête", async () => {
            (playerService.create as jest.Mock).mockImplementation((data, callback) => {
                callback(new BadRequestException('Invalid data'), null);
            });

            await expect(controller.create({ id: '', rank: 0 })).rejects.toEqual(new BadRequestException('Invalid data'));
        });

        it("doit retourner une erreur 409 si le joueur existe déjà", async () => {
            (playerService.create as jest.Mock).mockImplementation((data, callback) => {
                callback(new ConflictException('Player already exists'), null);
            });

            await expect(controller.create({ id: 'John Doe', rank: 5 })).rejects.toEqual(new ConflictException('Player already exists'));
        });
    });

    describe('DELETE /api/player/:id', () => {
        it('doit supprimer un joueur', (done) => {
            (playerService.remove as jest.Mock).mockImplementation((id, callback) => {
                callback(null);
            });

            controller.remove('1', (err) => {
                expect(err).toBeNull();
                done();
            });
        });
    });
});
