import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PlayerService } from '../players/players.service';
import { UnprocessableEntityException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('MatchController', () => {
  let app: INestApplication;
  let matchService: MatchService;
  let playerService: PlayerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: PlayerService,
          useValue: {
            findOne: jest.fn(),
            updateRank: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    matchService = module.get<MatchService>(MatchService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should publish match and return result', async () => {
    const mockResult = {
      winner: { id: '1', name: 'Winner', rank: 1500 },
      loser: { id: '2', name: 'Loser', rank: 1400 },
    };

    const mockPublish = jest.fn().mockImplementation((matchDTO, callback) => {
      callback(null, mockResult);
    });

    matchService.publish = mockPublish;

    const response = await request(app.getHttpServer())
      .post('/api/match')
      .send({
        winner: '1',
        loser: '2',
        draw: false,
      })
      .expect(201);

    expect(response.body).toEqual(mockResult);
    expect(matchService.publish).toHaveBeenCalled();
  });

  it('should handle error when winner not found', async () => {
    const mockPublish = jest.fn().mockImplementation((matchDTO, callback) => {
      callback(new UnprocessableEntityException('Player 1 not found'));
    });

    matchService.publish = mockPublish;

    const response = await request(app.getHttpServer())
      .post('/api/match')
      .send({
        winner: '1',
        loser: '2',
        draw: false,
      })
      .expect(422);

    expect(response.body.message).toBe('Player 1 not found');
  });

  it('should handle error when loser not found', async () => {
    const mockPublish = jest.fn().mockImplementation((matchDTO, callback) => {
      callback(new UnprocessableEntityException('Player 2 not found'));
    });

    matchService.publish = mockPublish;

    const response = await request(app.getHttpServer())
      .post('/api/match')
      .send({
        winner: '1',
        loser: '2',
        draw: false,
      })
      .expect(422);

    expect(response.body.message).toBe('Player 2 not found');
  });

  afterAll(async () => {
    await app.close();
  });
});
