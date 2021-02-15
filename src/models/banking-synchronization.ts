import { BankingMovement } from './banking-movement';
import { BankingBalance } from './banking-balance';
import {
  BankingSynchronizationWarning,
  MovementDuplicationWarning,
  MovementMissingWarning,
} from './banking-synchronization-warning';

interface BankingSynchronizationProps {
  movements: BankingMovement[];
}

export class BankingSynchronization {
  private movementsIds: number[];
  private movementMap: Map<number, BankingMovement>;

  constructor(props: BankingSynchronizationProps = { movements: [] }) {
    this.movementsIds = props.movements.map((item) => item.id);
    this.movementMap = new Map(props.movements.map((item) => [item.id, item]));
  }

  // Method to clean and check balances
  private checkBalances(balances: BankingBalance[]): BankingBalance[] {
    const balanceMap = new Map<string, BankingBalance>(
      balances.map((item) => [item.id, item]),
    );
    const orderedBalances = Array.from(balanceMap.values());
    orderedBalances.sort((itemA, itemB) => itemA.time - itemB.time);
    if (orderedBalances.length < 2) {
      throw new Error('Not enough bank balances.');
    }
    Array.from(this.movementMap.values()).forEach((item) => {
      const firstBalance = orderedBalances[0];
      const lastBalance = orderedBalances[orderedBalances.length - 1];
      const isMissingBalance = (item.time <= firstBalance.time || item.time > lastBalance.time);
      if (isMissingBalance) {
        throw new Error('Missing balances to validate movements');
      }
    })
    return orderedBalances;
  }

  // Method to check for duplicated movements
  private checkDuplicatedMovements(): BankingSynchronizationWarning[] {
    const warnings = new Array<BankingSynchronizationWarning>();
    const unicitySet = new Set();
    this.movementsIds.forEach((item) => {
      if (unicitySet.has(item)) {
        const movement = this.movementMap.get(item);
        warnings.push(new MovementDuplicationWarning({ movement }));
      } else {
        unicitySet.add(item);
      }
    });
    return warnings;
  }

  // Method to check for missed movements
  private checkMissedMovements(
    startBalance: BankingBalance,
    endBalance: BankingBalance,
  ): BankingSynchronizationWarning {
    const periodTotalAmount = Array.from(this.movementMap.values())
      .filter(
        (item) => item.time <= endBalance.time && item.time > startBalance.time,
      )
      .reduce((prev, item) => prev + item.amount, 0);
    const expectedBalance = startBalance.balance + periodTotalAmount;
    const difference = endBalance.balance - expectedBalance;
    if (difference !== 0) {
      return new MovementMissingWarning({
        startDate: startBalance.date,
        endDate: endBalance.date,
        difference,
      });
    }
  }

  // Method to validate banking synchronization by using control points
  validate(balances: BankingBalance[]): BankingSynchronizationWarning[] {
    const orderedBalances = this.checkBalances(balances);
    let warnings: BankingSynchronizationWarning[] = this.checkDuplicatedMovements();
    for (let index = 0; index <= orderedBalances.length - 2; ++index) {
      const checkResult = this.checkMissedMovements(
        orderedBalances[index],
        orderedBalances[index + 1],
      );
      warnings = checkResult ? [...warnings, checkResult] : warnings;
    }
    return warnings;
  }
}
