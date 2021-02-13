import { BankingMovement } from './banking-movement';
import { BankingBalance } from './banking-balance';
import {
  BankingSynchronizationWarning,
  MovementDuplicationWarning,
} from './banking-synchronization-warning';

interface BankingSynchronizationProps {
  movements: BankingMovement[];
}

export class BankingSynchronization {
  private movements: BankingMovement[];

  constructor(props: BankingSynchronizationProps = { movements: [] }) {
    this.movements = props.movements;
  }

  // Method to clean and check balances
  private checkBalances(balances: BankingBalance[]): BankingBalance[] {
    const balanceMap = new Map<string, BankingBalance>();
    balances.forEach((item) => balanceMap.set(item.id, item));
    if (balanceMap.size < 2) {
      throw new BankingSynchronizationValidationError(
        'Not enough bank balances.',
      );
    }
    return Object.values(balanceMap);
  }

  // Method to check for duplicated movements
  private checkDuplicatedMovements(): BankingSynchronizationWarning[] {
    const warnings = new Array<BankingSynchronizationWarning>();
    const movementsMap = new Map<number, BankingMovement>();
    this.movements.forEach((item) => {
      if (movementsMap.has(item.id)) {
        warnings.push(new MovementDuplicationWarning(item));
      } else {
        movementsMap.set(item.id, item);
      }
    });
    this.movements = Object.values(movementsMap);
    return warnings;
  }

  // Method to validate banking synchronization by using control points
  validate(balances: BankingBalance[]): BankingSynchronizationWarning[] {
    const checkedBalances = this.checkBalances(balances);
    let warnings = new Array<BankingSynchronizationWarning>();
    warnings = warnings.concat(this.checkDuplicatedMovements());
    return warnings;
  }
}

export class BankingSynchronizationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BankingSynchronizationValidationError';
  }
}
