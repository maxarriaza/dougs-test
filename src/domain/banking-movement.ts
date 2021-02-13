interface BankingMovementProps {
  id: number;
  date: Date;
  label: string;
  amount: number;
}

export class BankingMovement {
  id: number;
  date: Date;
  label: string;
  amount: number;

  constructor(props: Partial<BankingMovementProps> = {}) {
    this.id = props.id;
    this.date = props.date;
    this.label = props.label;
    this.amount = props.amount;
  }
}
