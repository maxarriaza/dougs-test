import { IsDefined, MinLength, ValidateNested } from 'class-validator';
import { BankingMovementDto } from './banking-movement.dto';
import { BankingBalanceDto } from './banking-balance.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BankingSynchronizationValidationDto {

  @ApiProperty({ type: BankingMovementDto, isArray: true })
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => BankingMovementDto)
  movements: BankingMovementDto[];

  @ApiProperty({ type: BankingBalanceDto, isArray: true })
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => BankingBalanceDto)
  balances: BankingBalanceDto[];
}