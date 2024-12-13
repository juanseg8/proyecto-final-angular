import { IProduct } from './product-model';

export interface ICartItem {
  id?: number | undefined;
  saleId?: number;
  product: IProduct;
  quantity: number;
  subTotal: number;
}
