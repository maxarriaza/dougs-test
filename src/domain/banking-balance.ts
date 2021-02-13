interface BankingBalanceProps {
  date: Date;
  balance: number;
}

export class BankingBalance {
  readonly date: Date;
  readonly balance: number;

  constructor(props: Partial<BankingBalanceProps> = {}) {
    this.date = props.date;
    this.balance = props.balance;
  }

  get id(): string {
    return this.date.toUTCString();
  }
}
