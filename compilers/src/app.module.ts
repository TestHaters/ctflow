import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CypressModule } from './cypress/cypress.module';

@Module({
  imports: [CypressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
