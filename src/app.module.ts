import { Module } from '@nestjs/common';
import { BankingSynchronizationController } from './api/controllers/banking-synchronization.controller';
import { BankingSynchronizationService } from './application/services/banking-synchronization.service';
import { BankingBalanceFactory } from './domain/factories/banking-balance.factory';
import { BankingSynchronizationFactory } from './domain/factories/banking-synchronization.factory';

@Module({
  imports: [],
  controllers: [BankingSynchronizationController],
  providers: [
    BankingSynchronizationService,
    BankingBalanceFactory,
    BankingSynchronizationFactory,
  ],
})
export class AppModule {}
