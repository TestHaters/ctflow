import { Test, TestingModule } from '@nestjs/testing';
import { CypressController } from './cypress.controller';
import { CypressService } from './cypress.service';

describe('CypressController', () => {
  let controller: CypressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CypressController],
      providers: [CypressService],
    }).compile();

    controller = module.get<CypressController>(CypressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
