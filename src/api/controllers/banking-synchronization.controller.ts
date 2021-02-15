import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';
import { BankingSynchronizationValidationDto } from '../dtos/banking-synchronization-validation.dto';
import { BankingSynchronizationService } from '../../application/services/banking-synchronization.service';
import { BankingSynchronizationValidationCommand } from '../../application/commands/banking-synchronization-validation.command';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Synchronization')
@Controller('/synchronizations')
export class BankingSynchronizationController {

  constructor(
    private readonly service: BankingSynchronizationService
  ) {}

  @Post('/:id/validation')
  @HttpCode(202)
  @ApiResponse({
    status: 202,
    description: 'Synchronization validated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Synchronization data cannot allow to process validation',
  })
  @ApiResponse({
    status: 409,
    description: 'Synchronization data cannot allow to process validation',
  })
  @ApiResponse({
    status: 422,
    description: 'Synchronization data are invalid',
  })
  async validate(@Body() dto: BankingSynchronizationValidationDto) {
    const command = new BankingSynchronizationValidationCommand(
      dto.movements,
      dto.balances,
    );
    const result = this.service.validate(command);
    if (result.error) {
      throw new BadRequestException({
        message: result.error,
      });
    } else if (result.warnings.length) {
      throw new ConflictException({
        message: 'Unable to validate synchronization',
        reasons: result.warnings,
      });
    }
  }
}