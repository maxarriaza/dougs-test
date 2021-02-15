export type BankingSynchronizationWarningProps =
  | MovementDuplicationWarningProps
  | MovementMissingWarningProps;

export type BankingSynchronizationWarning =
  | MovementDuplicationWarning
  | MovementMissingWarning;


export enum BankingSynchronizationWarningCode {
  MovementDuplicated = 1,
  MovementMissing = 2,
}

export interface MovementDuplicationWarningProps {
  code: BankingSynchronizationWarningCode.MovementDuplicated;
  movementId: number;
  movementLabel: string;
}

export class MovementDuplicationWarning {
  readonly code: BankingSynchronizationWarningCode.MovementDuplicated;
  readonly movementId: number;
  readonly movementLabel: string;

  constructor(
    props: Partial<MovementDuplicationWarningProps> = {
      code: BankingSynchronizationWarningCode.MovementDuplicated,
      movementId: null,
      movementLabel: null,
    },
  ) {
    this.code = BankingSynchronizationWarningCode.MovementDuplicated;
    this.movementId = props.movementId;
    this.movementLabel = props.movementLabel;
  }
}

export interface MovementMissingWarningProps {
  code: BankingSynchronizationWarningCode.MovementMissing;
  startDate: Date;
  endDate: Date;
  difference: number;
}

export class MovementMissingWarning {
  readonly code: BankingSynchronizationWarningCode.MovementMissing;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly difference: number;

  constructor(
    props: Partial<MovementMissingWarningProps> = {
      code: BankingSynchronizationWarningCode.MovementMissing,
      startDate: null,
      endDate: null,
      difference: null,
    },
  ) {
    this.code = BankingSynchronizationWarningCode.MovementMissing;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.difference = props.difference;
  }
}
