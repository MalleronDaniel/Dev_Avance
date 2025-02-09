import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './players.service';
import { Player } from '../typeorm/entities/player.entity';
import { ConflictException, BadRequestException, NotFoundException, Delete } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player.dto';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerRepository: Repository<Player>;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<PlayerService>(PlayerService);
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all players', async () => {
      const mockPlayers = [
        { id: '1', rank: 1500 },
        { id: '2', rank: 1400 },
      ];

      jest.spyOn(playerRepository, 'find').mockResolvedValue(mockPlayers);

      const result = await new Promise((resolve, reject) =>
        service.findAll((err, players) => (err ? reject(err) : resolve(players)))
      );

      expect(result).toEqual(mockPlayers);
    });

    it('should throw NotFoundException if no players found', async () => {
      jest.spyOn(playerRepository, 'find').mockResolvedValue([]);

      try {
        await new Promise((resolve, reject) =>
          service.findAll((err, players) => (err ? reject(err) : resolve(players)))
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("Le classement n'est pas disponible car aucun joueur n'existe");
      }
    });
  });

  describe('findOne', () => {
    it('should return one player by id', async () => {
      const mockPlayer = { id: '1', rank: 1500 };

      jest.spyOn(playerRepository, 'findOneBy').mockResolvedValue(mockPlayer);

      const result = await new Promise((resolve, reject) =>
        service.findOne('1', (err, player) => (err ? reject(err) : resolve(player)))
      );

      expect(result).toEqual(mockPlayer);
    });

    it('should return null if player not found', async () => {
      jest.spyOn(playerRepository, 'findOneBy').mockResolvedValue(null);

      const result = await new Promise((resolve, reject) =>
        service.findOne('nonexistent-id', (err, player) => (err ? reject(err) : resolve(player)))
      );

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new player', async () => {
      const createPlayerDto: CreatePlayerDto = { id: '1', rank: 1500 };
      const mockPlayer = { id: '1', rank: 1500 };

      jest.spyOn(playerRepository, 'find').mockResolvedValue([]);
      jest.spyOn(playerRepository, 'save').mockResolvedValue(mockPlayer);

      const result = await new Promise((resolve, reject) =>
        service.create(createPlayerDto, (err, player) => (err ? reject(err) : resolve(player)))
      );

      expect(result).toEqual(mockPlayer);
    });

    it('should throw BadRequestException if id is invalid', async () => {
      const createPlayerDto: CreatePlayerDto = { id: '', rank: 1500 };

      jest.spyOn(playerRepository, 'find').mockResolvedValue([]);

      try {
        await new Promise((resolve, reject) =>
          service.create(createPlayerDto, (err, player) => (err ? reject(err) : resolve(player)))
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe("L'identifiant du joueur n'est pas valide");
      }
    });

    it('should throw ConflictException if player already exists', async () => {
      const createPlayerDto: CreatePlayerDto = { id: '1', rank: 1500 };

      jest.spyOn(playerRepository, 'find').mockResolvedValue([{ id: '1', rank: 1500 }]);

      try {
        await new Promise((resolve, reject) =>
          service.create(createPlayerDto, (err, player) => (err ? reject(err) : resolve(player)))
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Le joueur existe déjà');
      }
    });
  });

  describe('remove', () => {
    it('should delete a player', async () => {
      jest.spyOn(playerRepository, 'delete').mockResolvedValue(new DeleteResult);

      const result = await new Promise((resolve, reject) =>
        service.remove('1', (err) => (err ? reject(err) : resolve(null)))
      );

      expect(result).toBeNull();
    });

    it('should throw NotFoundException if player not found', async () => {
      jest.spyOn(playerRepository, 'delete').mockResolvedValue(new DeleteResult);

      try {
        await new Promise((resolve, reject) =>
          service.remove('nonexistent-id', (err) => (err ? reject(err) : resolve(null)))
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Player not found');
      }
    });
  });

  describe('updateRank', () => {
    it('should update the player rank', async () => {
      const mockPlayer = { id: '1', rank: 1500 };
      jest.spyOn(playerRepository, 'findOneBy').mockResolvedValue(mockPlayer);
      jest.spyOn(playerRepository, 'save').mockResolvedValue(mockPlayer);

      const result = await new Promise((resolve, reject) =>
        service.updateRank('1', 1600, (err, player) => (err ? reject(err) : resolve(player)))
      );

      expect(result).toEqual(mockPlayer);
    });

    it('should throw BadRequestException if player not found', async () => {
      jest.spyOn(playerRepository, 'findOneBy').mockResolvedValue(null);

      try {
        await new Promise((resolve, reject) =>
          service.updateRank('nonexistent-id', 1600, (err, player) => (err ? reject(err) : resolve(player)))
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Joueur non trouvé');
      }
    });
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });
});
