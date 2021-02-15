import { Injectable } from '@nestjs/common';
import { BankingBalance, BankingBalanceProps } from '../banking-balance';

@Injectable()
export class BankingBalanceFactory {
  createFromProps(balanceData: BankingBalanceProps) {
    return new BankingBalance(balanceData);
  }
}