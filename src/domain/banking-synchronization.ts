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

  // Method to validate banking synchronization by using balances
  validate(balances: BankingBalance[]): any {}
}
