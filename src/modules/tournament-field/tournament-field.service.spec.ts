import { Test, TestingModule } from '@nestjs/testing';
import { TournamentFieldService } from './tournament-field.service';

describe('TournamentFieldService', () => {
  let service: TournamentFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentFieldService],
    }).compile();

    service = module.get<TournamentFieldService>(TournamentFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
