import { Component, OnInit } from '@angular/core';
import { ICartItem } from '../models/cart-item-model';
import { CartService } from './cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IProduct } from '../models/product-model';
import { FormSaleComponent } from '../form-sale/form-sale.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, FormSaleComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  items: ICartItem[] = [];
  faXMark = faXmark;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
    });
    console.log(this.items);
  }

  deleteProduct(product: IProduct) {
    this.cartService.deleteAllOfProduct(product);
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  getSubtotal(item: any): number {
    let subtotal = 0.0;
    subtotal = item.quantity * item.product.price;
    return subtotal;
  }

  getTotal(): number {
    return this.cartService.getTotalCart();
  }
}
