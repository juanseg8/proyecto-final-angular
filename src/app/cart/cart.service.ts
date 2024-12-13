import { Injectable } from '@angular/core';
import { ICartItem } from '../models/cart-item-model';
import { IProduct } from '../models/product-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: ICartItem[] = [];
  private itemsSubject = new BehaviorSubject<ICartItem[]>(this.items);

  public items$ = this.itemsSubject.asObservable();

  constructor() {}

  addProduct(prod: IProduct, quant: number = 1) {
    const exists = this.items.find((item) => item.product.id === prod.id);
    if (exists) {
      exists.quantity += quant;
      exists.subTotal = exists.product.price * exists.quantity;
    } else {
      const subTotal = prod.price * quant;
      this.items.push({
        product: prod,
        quantity: quant,
        subTotal: subTotal,
      });
    }
    this.itemsSubject.next(this.items);
  }

  deleteProduct(product: IProduct) {
    const productIndex = this.items.findIndex(
      (item) => item.product.id === product.id
    );

    if (productIndex !== -1) {
      const item = this.items[productIndex];

      if (item.quantity > 1) {
        item.quantity -= 1;
        item.subTotal = item.product.price * item.quantity;
      } else {
        this.items.splice(productIndex, 1);
      }

      this.itemsSubject.next(this.items);
    }
  }

  deleteAllOfProduct(product: IProduct) {
    this.items = this.items.filter((item) => item.product.id !== product.id);
    this.itemsSubject.next(this.items);
  }

  clearCart() {
    this.items = [];
    this.itemsSubject.next(this.items);
  }

  getTotalCart(): number {
    let total = 0.0;

    for (let item of this.items) {
      total += item.product.price * item.quantity;
    }
    return total;
  }

  getQuantity(): number {
    return this.items.length;
  }
}
