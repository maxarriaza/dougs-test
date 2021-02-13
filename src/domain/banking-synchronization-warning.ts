import { BankingMovement } from './banking-movement';

enum BankingSynchronizationWarningCode {
  MovementDuplicated = 1,
}

export abstract class BankingSynchronizationWarning {
  readonly code: BankingSynchronizationWarningCode;

  protected constructor(code: BankingSynchronizationWarningCode) {
    this.code = code;
  }
}

export class MovementDuplicationWarning extends BankingSynchronizationWarning {
  readonly movement: BankingMovement;

  constructor(movement: BankingMovement) {
    super(BankingSynchronizationWarningCode.MovementDuplicated);
    this.movement = movement;
  }
}
