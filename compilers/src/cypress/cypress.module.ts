import { Module } from '@nestjs/common';
import { CypressService } from './cypress.service';
import { CypressController } from './cypress.controller';

@Module({
  controllers: [CypressController],
  providers: [CypressService],
})
export class CypressModule {}
