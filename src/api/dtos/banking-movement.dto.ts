import { IsDate, IsDefined, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BankingMovementDto {

  @ApiProperty()
  @Min(0)
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsDefined()
  id: number;

  @ApiProperty()
  @IsDate()
  @IsDefined()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsString()
  @IsDefined()
  label: string;

  @ApiProperty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsDefined()
  amount: number;
}