import { IsDate, IsDefined, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BankingBalanceDto {

  @ApiProperty()
  @IsDate()
  @IsDefined()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsDefined()
  balance: number;
}