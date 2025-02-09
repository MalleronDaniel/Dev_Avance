import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PlayerService } from '../players/players.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { MatchResultDTO, PublishMatchDto } from './dto/post-match.dto';
import { Player } from '../typeorm/entities/player.entity';

describe('MatchService', () => {
  let matchService: MatchService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: PlayerService,
          useValue: {
            findOne: jest.fn(),
            updateRank: jest.fn(),
          },
        },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(matchService).toBeDefined();
  });

  it('should calculate new Elo ranks correctly', () => {
    const winnerRank = 1500;
    const loserRank = 1400;

    const [newWinnerRank, newLoserRank] = matchService['calculateElo'](winnerRank, loserRank);

    expect(newWinnerRank).toBeGreaterThan(winnerRank);
    expect(newLoserRank).toBeLessThan(loserRank);
  });

  it('should publish match and return result', async () => {
    const mockWinner = { id: '1', name: 'Winner', rank: 1500 } as Player;
    const mockLoser = { id: '2', name: 'Loser', rank: 1400 } as Player;

    playerService.findOne = jest
      .fn()
      .mockImplementationOnce((id, callback) => callback(null, mockWinner))
      .mockImplementationOnce((id, callback) => callback(null, mockLoser));

    const mockUpdateRank = jest.fn().mockImplementation((id, rank, callback) => callback(null, { id, rank }));

    playerService.updateRank = mockUpdateRank;

    const matchDTO: PublishMatchDto = {
      winner: '1',
      loser: '2',
      draw: false,
    };

    const result = await new Promise<MatchResultDTO>((resolve, reject) => {
      matchService.publish(matchDTO, (error, result : MatchResultDTO) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    expect(result).toEqual({
      winner: mockWinner,
      loser: mockLoser,
    });

    // Vérifier que la méthode updateRank a été appelée pour les deux joueurs
    expect(mockUpdateRank).toHaveBeenCalledTimes(2);
    expect(mockUpdateRank).toHaveBeenCalledWith(mockWinner.id, expect.any(Number), expect.any(Function));
    expect(mockUpdateRank).toHaveBeenCalledWith(mockLoser.id, expect.any(Number), expect.any(Function));
  });

  it('should handle error when winner not found', (done) => {
    // Mocking findOne to simulate the case where winner is not found
    jest.spyOn(playerService, 'findOne').mockImplementation((id, callback) => {
      if (id === '1') {
        callback(null, null);  // Simulating winner not found
      } else {
        callback(null, { id, rank: 1500 } as Player); // Simulating a found player
      }
    });

    const matchDTO = { winner: '1', loser: '2', draw: false };

    matchService.publish(matchDTO, (err, result) => {
      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.message).toBe('Player 1 not found');
      done();
    });
  });

  it('should handle error when loser not found', (done) => {
    // Mocking findOne to simulate the case where loser is not found
    jest.spyOn(playerService, 'findOne').mockImplementation((id, callback) => {
      if (id === '2') {
        callback(null, null);  // Simulating player not found
      } else {
        callback(null, { id, rank: 1500 } as Player); // Simulating a found player
      }
    });

    const matchDTO = { winner: '1', loser: '2', draw: false };

    matchService.publish(matchDTO, (err, result) => {
      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.message).toBe('Player 2 not found');
      done();
    });
  });
});
