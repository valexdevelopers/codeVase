import { Test, TestingModule } from '@nestjs/testing';
import { TaskAttemptController } from './task-attempt.controller';
import { TaskAttemptService } from './task-attempt.service';

describe('TaskAttemptController', () => {
  let controller: TaskAttemptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskAttemptController],
      providers: [TaskAttemptService],
    }).compile();

    controller = module.get<TaskAttemptController>(TaskAttemptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
