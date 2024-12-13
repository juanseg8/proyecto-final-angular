import { ISaleItem } from './sale-item-model';

export interface ISale {
  id?: number | undefined;
  buyer: string;
  date: string;
  withdraw: string;
  address?: string;
  paymentMethod: string;
  total: number;
  saleItems: ISaleItem[];
}
