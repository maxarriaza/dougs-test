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

  static OrderByDate(balanceA: BankingBalance, balanceB: BankingBalance) {
    return balanceA.date.getTime() - balanceB.date.getTime();
  }

  get id(): string {
    return this.date.toUTCString();
  }

  get time(): number {
    return this.date.getTime();
  }
}
