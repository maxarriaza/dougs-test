import { BankingSynchronizationWarningProps } from '../../domain/banking-synchronization-warning';
import { BankingMovementProps } from '../../domain/banking-movement';
import { BankingBalanceProps } from '../../domain/banking-balance';

export class BankingSynchronizationValidationCommand {
  constructor(
    readonly movements: BankingMovementProps[] = [],
    readonly balances: BankingBalanceProps[] = [],
  ) {}
}

export class BankingSynchronizationValidationResult {
  constructor(
    readonly warnings: BankingSynchronizationWarningProps[] = [],
    readonly error: string = null,
  ) {}
}