import { ExpensesGroupScheme } from './ExpensesGroupScheme';
import {ExpensesScheme} from './ExpensesScheme';

export interface GetPersonalExpensesResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  gastos: ExpensesScheme[];
}

export interface GetGroupExpensesResponse {
  currentPage: number;
  gastos: ExpensesGroupScheme[];
}
