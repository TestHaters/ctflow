import { Test, TestingModule } from '@nestjs/testing';
import { CypressService } from './cypress.service';

describe('CypressService', () => {
  let service: CypressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CypressService],
    }).compile();

    service = module.get<CypressService>(CypressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
