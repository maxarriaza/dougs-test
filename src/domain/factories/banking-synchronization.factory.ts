import { Injectable } from '@nestjs/common';
import { BankingMovement, BankingMovementProps } from '../banking-movement';
import { BankingSynchronization } from '../banking-synchronization';

@Injectable()
export class BankingSynchronizationFactory {
  createFromProps(movementsData: BankingMovementProps[]) {
    const movements = movementsData.map((item) => new BankingMovement(item));
    return new BankingSynchronization({ movements });
  }
}