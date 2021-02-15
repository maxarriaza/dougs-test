import { Injectable } from '@nestjs/common';
import {
  BankingSynchronizationValidationCommand,
  BankingSynchronizationValidationResult,
} from '../commands/banking-synchronization-validation.command';
import { BankingSynchronizationFactory } from '../../domain/factories/banking-synchronization.factory';
import { BankingBalanceFactory } from '../../domain/factories/banking-balance.factory';

@Injectable()
export class BankingSynchronizationService {

  constructor(
    private readonly synchronizationFactory: BankingSynchronizationFactory,
    private readonly balanceFactory: BankingBalanceFactory,
  ) {}

  // Method to validate synchronization
  validate(command: BankingSynchronizationValidationCommand) {
    const synchronization = this.synchronizationFactory.createFromProps(
      command.movements,
    );
    const balances = command.balances.map((item) =>
      this.balanceFactory.createFromProps(item),
    );
    try {
      const warnings = synchronization.validate(balances);
      return new BankingSynchronizationValidationResult(warnings, null);
    } catch (err) {
      return new BankingSynchronizationValidationResult([], err.message);
    }
  }
}