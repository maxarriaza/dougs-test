import { BankingSynchronizationService } from '../../application/services/banking-synchronization.service';
import { BankingSynchronizationController } from './banking-synchronization.controller';
import { BankingSynchronizationValidationResult } from '../../application/commands/banking-synchronization-validation.command';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { BankingSynchronizationValidationDto } from '../dtos/banking-synchronization-validation.dto';

describe('BankingSynchronizationController', () => {
  let service: BankingSynchronizationService;
  let controller: BankingSynchronizationController;

  beforeEach(() => {
    service = new BankingSynchronizationService(null, null);
    controller = new BankingSynchronizationController(service);
  });

  test('with result containing an error should throw an error', async () => {
    const cmdResult = new BankingSynchronizationValidationResult(
      [],
      'Processing error',
    );
    service.validate = jest.fn().mockReturnValue(cmdResult);

    const dto = new BankingSynchronizationValidationDto();
    await expect(controller.validate(dto)).rejects.toEqual(
      new BadRequestException({
        message: cmdResult.error,
      }),
    );
  });

  test('with result containing warnings should throw an error', async () => {
    const cmdResult = new BankingSynchronizationValidationResult(
      [
        {
          code: 1,
          movementId: 23,
          movementLabel: 'Movement label',
        },
      ],
      null,
    );
    service.validate = jest.fn().mockReturnValue(cmdResult);

    const dto = new BankingSynchronizationValidationDto();
    await expect(controller.validate(dto)).rejects.toEqual(
      new ConflictException({
        message: 'Unable to validate synchronization',
        reasons: cmdResult.warnings,
      }),
    );
  });

  test('with result containing no warnings and no errors should work', async () => {
    const cmdResult = new BankingSynchronizationValidationResult([], null);
    service.validate = jest.fn().mockReturnValue(cmdResult);

    const dto = new BankingSynchronizationValidationDto();
    await expect(controller.validate(dto)).resolves.toBe(undefined);
  });
});
