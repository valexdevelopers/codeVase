import { Test, TestingModule } from '@nestjs/testing';
import { TaskAttemptService } from './task-attempt.service';

describe('TaskAttemptService', () => {
  let service: TaskAttemptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskAttemptService],
    }).compile();

    service = module.get<TaskAttemptService>(TaskAttemptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
