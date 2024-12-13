import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.css'],
})
export class CartIconComponent implements OnInit {
  faCartShopping = faCartShopping;
  quantity = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.quantity = items.reduce((total, item) => total + item.quantity, 0);
    });
  }
}
