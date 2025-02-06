import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('PlayersController', () => {
  let controller: PlayerController;
  let service: PlayerService;

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
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return an array of players', () => {
    const result = [{ id: '1', rank: 1 }];
    jest.spyOn(service, 'findAll').mockImplementation((cb) => cb(null, result));

    controller.findAll((err, players) => {
      expect(players).toEqual(result);
    });
  });

  it('should handle error in findAll', () => {
    const error = new Error('Error');
    jest.spyOn(service, 'findAll').mockImplementation((cb) => cb(error, null));

    controller.findAll((err, players) => {
      expect(err).toEqual(error);
      expect(players).toBeUndefined();
    });
  });

  it('should call findOne and return a player', () => {
    const result = { id: '1', rank: 1 };
    jest.spyOn(service, 'findOne').mockImplementation((id, cb) => cb(null, result));

    controller.findOne('1', (err, player) => {
      expect(player).toEqual(result);
    });
  });

  it('should handle error in findOne', () => {
    const error = new Error('Error');
    jest.spyOn(service, 'findOne').mockImplementation((id, cb) => cb(error, null));

    controller.findOne('1', (err, player) => {
      expect(err).toEqual(error);
      expect(player).toBeUndefined();
    });
  });

  it('should call create and return a player', async () => {
    const playerDTO: CreatePlayerDto = { name: 'John', rank: 1 };
    const result = { id: '1', rank: 1 };
    jest.spyOn(service, 'create').mockImplementation((dto, cb) => cb(null, result));

    await expect(controller.create(playerDTO)).resolves.toEqual({ id: '1', rank: 1 });
  });

  it('should handle BadRequestException on create', async () => {
    const playerDTO: CreatePlayerDto = { name: 'John', rank: 1 };
    jest.spyOn(service, 'create').mockImplementation((dto, cb) => cb(new BadRequestException('Bad Request'), null));

    await expect(controller.create(playerDTO)).rejects.toEqual({ code: 400, message: 'Bad Request' });
  });

  it('should handle ConflictException on create', async () => {
    const playerDTO: CreatePlayerDto = { name: 'John', rank: 1 };
    jest.spyOn(service, 'create').mockImplementation((dto, cb) => cb(new ConflictException('Conflict'), null));

    await expect(controller.create(playerDTO)).rejects.toEqual({ code: 409, message: 'Conflict' });
  });

  it('should call remove and return void', () => {
    jest.spyOn(service, 'remove').mockImplementation((id, cb) => cb(null));

    controller.remove('1', (err) => {
      expect(err).toBeNull();
    });
  });

  it('should handle error in remove', () => {
    const error = new Error('Error');
    jest.spyOn(service, 'remove').mockImplementation((id, cb) => cb(error));

    controller.remove('1', (err) => {
      expect(err).toEqual(error);
    });
  });
});
