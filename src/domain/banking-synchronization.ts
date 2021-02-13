import { BankingMovement } from './banking-movement';
import { BankingBalance } from './banking-balance';

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

  // Method to validate banking synchronization by using control points
  validate(balances: BankingBalance[]): any {
    const checkedBalances = this.checkBalances(balances);
    throw new Error('NotImplemented');
  }
}

export class BankingSynchronizationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BankingSynchronizationValidationError';
  }
}
