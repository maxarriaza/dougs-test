import { BankingMovement } from './banking-movement';

enum BankingSynchronizationWarningCode {
  MovementDuplicated = 1,
  MovementMissing = 2,
}

export abstract class BankingSynchronizationWarning {
  readonly code: BankingSynchronizationWarningCode;

  protected constructor(code: BankingSynchronizationWarningCode) {
    this.code = code;
  }
}

interface MovementDuplicationWarningProps {
  movement: BankingMovement;
}

export class MovementDuplicationWarning extends BankingSynchronizationWarning {
  readonly movement: BankingMovement;

  constructor(props: MovementDuplicationWarningProps) {
    super(BankingSynchronizationWarningCode.MovementDuplicated);
    this.movement = props.movement;
  }
}

interface MovementMissingWarningProps {
  startDate: Date;
  endDate: Date;
  difference: number;
}

export class MovementMissingWarning extends BankingSynchronizationWarning {
  readonly startDate: Date;
  readonly endDate: Date;
  readonly difference: number;

  constructor(props: MovementMissingWarningProps) {
    super(BankingSynchronizationWarningCode.MovementMissing);
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.difference = props.difference;
  }
}
