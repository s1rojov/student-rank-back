import { Test, TestingModule } from '@nestjs/testing';
import { TournamentFieldController } from './tournament-field.controller';
import { TournamentFieldService } from './tournament-field.service';

describe('TournamentFieldController', () => {
  let controller: TournamentFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentFieldController],
      providers: [TournamentFieldService],
    }).compile();

    controller = module.get<TournamentFieldController>(
      TournamentFieldController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
