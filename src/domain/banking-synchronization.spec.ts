import { BankingMovement } from './banking-movement';
import {
  BankingSynchronization,
  BankingSynchronizationValidationError,
} from './banking-synchronization';
import { BankingBalance } from './banking-balance';
import { MovementDuplicationWarning } from './banking-synchronization-warning';

describe('BankingSynchronization', () => {
  describe('validate', () => {
    test('with no balance should raise an processing error', () => {
      const synchronization = new BankingSynchronization();
      expect(() => synchronization.validate([])).toThrow(
        BankingSynchronizationValidationError,
      );
    });

    test('with one balance should raise a processing error', () => {
      const synchronization = new BankingSynchronization();
      const start_balance = new BankingBalance({
        date: new Date(Date.UTC(111, 1, 1, 0, 0, 0, 0)),
        balance: 0,
      });
      expect(() => synchronization.validate([start_balance])).toThrow(
        BankingSynchronizationValidationError,
      );
    });

    test('with two duplicated balances should raise a processing error', () => {
      const synchronization = new BankingSynchronization();
      const start_balance = new BankingBalance({
        date: new Date(Date.UTC(111, 1, 1, 0, 0, 0, 0)),
        balance: 0,
      });
      expect(() =>
        synchronization.validate([start_balance, start_balance]),
      ).toThrow(BankingSynchronizationValidationError);
    });

    test('with duplicated movements should return duplicated movement warning', () => {
      const movement = new BankingMovement({
        id: 1,
        amount: 10,
        label: 'Movement 1',
        date: new Date(Date.UTC(111, 1, 5, 12, 30, 0, 0)),
      });
      const synchronization = new BankingSynchronization({
        movements: [movement, movement],
      });
      const start_balance = new BankingBalance({
        date: new Date(Date.UTC(111, 1, 1, 0, 0, 0, 0)),
        balance: 0,
      });
      const end_balance = new BankingBalance({
        date: new Date(Date.UTC(111, 1, 31, 23, 59, 59, 999)),
        balance: 10,
      });
      const warnings = synchronization.validate([start_balance, end_balance]);
      expect(warnings).toContainEqual(new MovementDuplicationWarning(movement));
    });
  });
});
