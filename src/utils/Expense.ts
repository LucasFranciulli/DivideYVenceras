export interface Expense {
  id: number;
  name: string;
  description: string;
  amount: number;
  expirationDate?: Date;
  category?: string;
}
