import { Component, Input } from '@angular/core';
import { IProduct } from '../../models/product-model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart/cart.service';
import { FormsModule } from '@angular/forms';
import { ICartItem } from '../../models/cart-item-model';

@Component({
  selector: 'app-card-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-products.component.html',
  styleUrl: './card-products.component.css',
})
export class CardProductsComponent {
  @Input() product!: IProduct;
  inCart = false;
  quantity = 0;
  item?: ICartItem;
  items: ICartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.item = items.find((item) => item.product.id === this.product.id);

      if (this.item !== undefined) {
        this.quantity = this.item.quantity;
        this.inCart = true;
      } else {
        this.quantity = 0;
        this.inCart = false;
      }
    });
  }

  increaseQuantity(product: IProduct) {
    if (this.item) {
      this.cartService.addProduct(product);
    }
  }

  decreaseQuantity(product: IProduct) {
    this.cartService.deleteProduct(product);
  }

  addCart(product: IProduct) {
    this.cartService.addProduct(product);
  }
}
