import { BankingMovement } from './banking-movement';
import { BankingSynchronization } from './banking-synchronization';
import { BankingBalance } from './banking-balance';
import {
  MovementDuplicationWarning,
  MovementMissingWarning,
} from './banking-synchronization-warning';

describe('BankingSynchronization', () => {
  describe('validate', () => {
    test('with no balance should raise an error', () => {
      const synchronization = new BankingSynchronization();
      expect(() => synchronization.validate([])).toThrow(Error);
    });

    test('with one balance should raise an error', () => {
      const synchronization = new BankingSynchronization();
      const start_balance = new BankingBalance({
        date: new Date(Date.UTC(111, 1, 1, 0, 0, 0, 0)),
        balance: 0,
      });
      expect(() => synchronization.validate([start_balance])).toThrow(Error);
    });

    test('with two duplicated balances should raise an error', () => {
      const synchronization = new BankingSynchronization();
      const start_balance = new BankingBalance({
        date: new Date(Date.UTC(111, 1, 1, 0, 0, 0, 0)),
        balance: 0,
      });
      expect(() =>
        synchronization.validate([start_balance, start_balance]),
      ).toThrow(Error);
    });

    test('with duplicated movement should return duplicated movement warning', () => {
      const movement = new BankingMovement({
        id: 1,
        amount: 10,
        label: 'Movement 1',
        date: new Date(Date.UTC(2011, 0, 10, 12, 30, 0, 0)),
      });
      const synchronization = new BankingSynchronization({
        movements: [movement, movement],
      });
      const start_balance = new BankingBalance({
        date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
        balance: 0,
      });
      const end_balance = new BankingBalance({
        date: new Date(Date.UTC(2011, 0, 30, 23, 59, 59, 999)),
        balance: 10,
      });
      const warnings = synchronization.validate([start_balance, end_balance]);
      expect(warnings).toContainEqual(new MovementDuplicationWarning({ movement }));
    });

    test('with missing movements having positive amount on single period should return missing movement warning', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 10,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 0,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 100,
        }),
      ];
      const warnings = [
        new MovementMissingWarning({
          startDate: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          difference: 90,
        }),
      ];
      const synchronization = new BankingSynchronization({ movements });
      const result = synchronization.validate(balances);
      expect(result).toEqual(warnings);
    });

    test('with missing movements having negative amount on single period should return missing movement warning', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: -10,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 100,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 0,
        }),
      ];
      const warnings = [
        new MovementMissingWarning({
          startDate: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          difference: -90,
        }),
      ];
      const synchronization = new BankingSynchronization({ movements });
      const result = synchronization.validate(balances);
      expect(result).toEqual(warnings);
    });

    test('with missing movements having positive amount on several periods should return missing movement warning', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: -10,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: -20,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 200,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 100,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 0,
        }),
      ];
      const warnings = [
        new MovementMissingWarning({
          startDate: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          difference: -90,
        }),
        new MovementMissingWarning({
          startDate: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          difference: -80,
        }),
      ];
      const synchronization = new BankingSynchronization({ movements });
      const result = synchronization.validate(balances);
      expect(result).toEqual(warnings);
    });

    test('with missing movements having negative amount on several periods should return missing movement warning', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 10,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: 20,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 0,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 100,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 200,
        }),
      ];
      const warnings = [
        new MovementMissingWarning({
          startDate: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          difference: 90,
        }),
        new MovementMissingWarning({
          startDate: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          difference: 80,
        }),
      ];
      const synchronization = new BankingSynchronization({ movements });
      const result = synchronization.validate(balances);
      expect(result).toEqual(warnings);
    });

    test('with missing movements on several periods should return missing movement warning', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 150,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: -50,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 50,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 150,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 300,
        }),
      ];
      const warnings = [
        new MovementMissingWarning({
          startDate: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          difference: -50,
        }),
        new MovementMissingWarning({
          startDate: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          difference: 200,
        }),
      ];
      const synchronization = new BankingSynchronization({ movements });
      const result = synchronization.validate(balances);
      expect(result).toEqual(warnings);
    });

    test('with no duplicated or missing movements should not return warnings', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 150,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: -50,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 0, 15, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 3,
          amount: 150,
          label: 'Movement 3',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 4,
          amount: -50,
          label: 'Movement 4',
          date: new Date(Date.UTC(2011, 1, 10, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 5,
          amount: -50,
          label: 'Movement 5',
          date: new Date(Date.UTC(2011, 1, 20, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 50,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 150,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 200,
        }),
      ];
      const warnings = [];
      const synchronization = new BankingSynchronization({ movements });
      const result = synchronization.validate(balances);
      expect(result).toEqual(warnings);
    });

    test('with movements done before first balance time should raise an error', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 150,
          label: 'Movement 1',
          date: new Date(Date.UTC(2010, 11, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: -50,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
        }),
        new BankingMovement({
          id: 3,
          amount: 150,
          label: 'Movement 3',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 4,
          amount: -50,
          label: 'Movement 4',
          date: new Date(Date.UTC(2011, 1, 10, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 5,
          amount: -50,
          label: 'Movement 5',
          date: new Date(Date.UTC(2011, 1, 20, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 50,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 150,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 200,
        }),
      ];
      const synchronization = new BankingSynchronization({ movements });
      expect(() => synchronization.validate(balances)).toThrow(Error);
    });

    test('with movement on first balance time should raise an error', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 150,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: -50,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 0, 3, 6, 21, 7, 0)),
        }),
        new BankingMovement({
          id: 3,
          amount: 150,
          label: 'Movement 3',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 4,
          amount: -50,
          label: 'Movement 4',
          date: new Date(Date.UTC(2011, 1, 10, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 5,
          amount: -50,
          label: 'Movement 5',
          date: new Date(Date.UTC(2011, 1, 20, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 50,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 150,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 200,
        }),
      ];
      const synchronization = new BankingSynchronization({ movements });
      expect(() => synchronization.validate(balances)).toThrow(Error);
    });

    test('with movement on mid balance time should not return warnings', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 150,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: -50,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
        }),
        new BankingMovement({
          id: 3,
          amount: 150,
          label: 'Movement 3',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 4,
          amount: -50,
          label: 'Movement 4',
          date: new Date(Date.UTC(2011, 1, 10, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 5,
          amount: -50,
          label: 'Movement 5',
          date: new Date(Date.UTC(2011, 1, 20, 12, 30, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 50,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 150,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 200,
        }),
      ];
      const warnings = [];
      const synchronization = new BankingSynchronization({ movements });
      const result = synchronization.validate(balances);
      expect(result).toEqual(warnings);
    });

    test('with movement on last balance time should not return warnings', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 150,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: -50,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 0, 15, 0, 0, 0, 0)),
        }),
        new BankingMovement({
          id: 3,
          amount: 150,
          label: 'Movement 3',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 4,
          amount: -50,
          label: 'Movement 4',
          date: new Date(Date.UTC(2011, 1, 10, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 5,
          amount: -50,
          label: 'Movement 5',
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 50,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 150,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 200,
        }),
      ];
      const warnings = [];
      const synchronization = new BankingSynchronization({ movements });
      const result = synchronization.validate(balances);
      expect(result).toEqual(warnings);
    });

    test('with movements done after last balance time should raise an error', () => {
      const movements = [
        new BankingMovement({
          id: 1,
          amount: 150,
          label: 'Movement 1',
          date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 2,
          amount: -50,
          label: 'Movement 2',
          date: new Date(Date.UTC(2011, 0, 15, 0, 0, 0, 0)),
        }),
        new BankingMovement({
          id: 3,
          amount: 150,
          label: 'Movement 3',
          date: new Date(Date.UTC(2011, 1, 5, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 4,
          amount: -50,
          label: 'Movement 4',
          date: new Date(Date.UTC(2011, 1, 10, 12, 30, 0, 0)),
        }),
        new BankingMovement({
          id: 5,
          amount: -50,
          label: 'Movement 5',
          date: new Date(Date.UTC(2011, 2, 5, 0, 0, 0, 0)),
        }),
      ];
      const balances = [
        new BankingBalance({
          date: new Date(Date.UTC(2011, 0, 0, 0, 0, 0, 0)),
          balance: 50,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 1, 0, 0, 0, 0, 0)),
          balance: 150,
        }),
        new BankingBalance({
          date: new Date(Date.UTC(2011, 2, 0, 0, 0, 0, 0)),
          balance: 200,
        }),
      ];
      const synchronization = new BankingSynchronization({ movements });
      expect(() => synchronization.validate(balances)).toThrow(Error);
    });
  });
});
