import { BankingSynchronizationService } from './banking-synchronization.service';
import { BankingSynchronization } from '../../domain/banking-synchronization';
import { BankingBalance } from '../../domain/banking-balance';
import {
  MovementDuplicationWarning,
  MovementMissingWarning,
} from '../../domain/banking-synchronization-warning';
import {
  BankingSynchronizationValidationCommand,
  BankingSynchronizationValidationResult,
} from '../commands/banking-synchronization-validation.command';
import { BankingSynchronizationFactory } from '../../domain/factories/banking-synchronization.factory';
import { BankingBalanceFactory } from '../../domain/factories/banking-balance.factory';

describe('BankingSynchronizationService', () => {
  let synchronizationFactory: BankingSynchronizationFactory;
  let balanceFactory: BankingBalanceFactory;
  let service: BankingSynchronizationService;

  beforeEach(() => {
    synchronizationFactory = new BankingSynchronizationFactory();
    balanceFactory = new BankingBalanceFactory();
    service = new BankingSynchronizationService(
      synchronizationFactory,
      balanceFactory,
    );
  });

  describe('validate', () => {
    test('when validate return no warning', () => {
      const balance1 = new BankingBalance({
        date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        balance: 300,
      });
      const balance2 = new BankingBalance({
        date: new Date(Date.UTC(2012, 0, 5, 12, 30, 0, 0)),
        balance: 400,
      });
      balanceFactory.createFromProps = jest
        .fn()
        .mockReturnValueOnce(balance1)
        .mockReturnValue(balance2);

      const sync = new BankingSynchronization();
      synchronizationFactory.createFromProps = jest.fn().mockReturnValue(sync);

      sync.validate = jest.fn().mockReturnValue([]);

      const command = new BankingSynchronizationValidationCommand(
        [],
        [
          {
            date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
            balance: 300,
          },
          {
            date: new Date(Date.UTC(2012, 0, 5, 12, 30, 0, 0)),
            balance: 400,
          },
        ],
      );
      const result = service.validate(command);
      expect(result).toEqual(
        new BankingSynchronizationValidationResult([], null),
      );
      expect(sync.validate).toHaveBeenCalledWith([balance1, balance2]);
    });

    test('when validate return warnings', () => {
      const balance1 = new BankingBalance({
        date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        balance: 300,
      });
      const balance2 = new BankingBalance({
        date: new Date(Date.UTC(2012, 0, 5, 12, 30, 0, 0)),
        balance: 400,
      });

      balanceFactory.createFromProps = jest
        .fn()
        .mockReturnValueOnce(balance1)
        .mockReturnValue(balance2);

      const sync = new BankingSynchronization();
      synchronizationFactory.createFromProps = jest.fn().mockReturnValue(sync);

      const warning1 = new MovementMissingWarning({
        startDate: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        endDate: new Date(Date.UTC(2012, 0, 5, 12, 30, 0, 0)),
        difference: 100,
      });
      const warning2 = new MovementDuplicationWarning();
      sync.validate = jest.fn().mockReturnValue([warning1, warning2]);

      const command = new BankingSynchronizationValidationCommand(
        [],
        [
          {
            date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
            balance: 300,
          },
          {
            date: new Date(Date.UTC(2012, 0, 5, 12, 30, 0, 0)),
            balance: 400,
          },
        ],
      );
      const result = service.validate(command);
      expect(result).toEqual(
        new BankingSynchronizationValidationResult([warning1, warning2], null),
      );
      expect(sync.validate).toHaveBeenCalledWith([balance1, balance2]);
    });

    test('when validate raise error', () => {
      const balance1 = new BankingBalance({
        date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
        balance: 300,
      });
      const balance2 = new BankingBalance({
        date: new Date(Date.UTC(2012, 0, 5, 12, 30, 0, 0)),
        balance: 400,
      });

      balanceFactory.createFromProps = jest
        .fn()
        .mockReturnValueOnce(balance1)
        .mockReturnValue(balance2);

      const sync = new BankingSynchronization();
      synchronizationFactory.createFromProps = jest.fn().mockReturnValue(sync);

      const error = new Error('error message');
      sync.validate = jest.fn().mockImplementation(() => {
        throw error;
      });

      const command = new BankingSynchronizationValidationCommand(
        [],
        [
          {
            date: new Date(Date.UTC(2011, 0, 5, 12, 30, 0, 0)),
            balance: 300,
          },
          {
            date: new Date(Date.UTC(2012, 0, 5, 12, 30, 0, 0)),
            balance: 400,
          },
        ],
      );
      const result = service.validate(command);
      expect(result).toEqual(
        new BankingSynchronizationValidationResult([], error.message),
      );
      expect(sync.validate).toHaveBeenCalledWith([balance1, balance2]);
    });
  });
});
