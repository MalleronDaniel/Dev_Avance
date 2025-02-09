import { Test, TestingModule } from '@nestjs/testing';
import { RankController } from './rank.controller';
import { PlayerService } from '../players/players.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../typeorm/entities/player.entity';

describe('RankController', () => {
  let controller: RankController;
  let playerService: PlayerService;
  let eventEmitter: EventEmitter2;
  let playerRepository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankController],
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<RankController>(RankController);
    playerService = module.get<PlayerService>(PlayerService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sse', () => {
    it('should return player updates as an event', async () => {
      const mockPlayer = { id: '1', rank: 1500 } as Player;
      const sseSpy = jest.spyOn(controller['eventEmitter'], 'emit');

      // Triggering SSE event
      eventEmitter.emit('player.updated', mockPlayer);

      const result = await controller.sse().toPromise();
      expect(result).toHaveProperty('data');
      expect(result!.data).toHaveProperty('type', 'RankingUpdate');
      expect(result!.data.player).toHaveProperty('id', mockPlayer.id);
      expect(result!.data.player).toHaveProperty('rank', mockPlayer.rank);
    });
  });

  describe('ranking', () => {
    it('should return sorted list of players by rank', async () => {
      const mockPlayers = [
        { id: '1', rank: 1500 } as Player,
        { id: '2', rank: 2000 } as Player,
        { id: '3', rank: 1200 } as Player,
      ];

      jest.spyOn(playerService, 'findAll').mockImplementation((callback) => {
        callback(null, mockPlayers);
      });

      const result = await controller.ranking();
      expect(result).toEqual([
        { id: '2', rank: 2000 },
        { id: '1', rank: 1500 },
        { id: '3', rank: 1200 },
      ]);
    });

    it('should throw an error if players cannot be found', async () => {
      jest.spyOn(playerService, 'findAll').mockImplementation((callback) => {
        callback(new BadRequestException('Players not found'), undefined);
      });

      try {
        await controller.ranking();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Players not found');
      }
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
