import { Component, Input } from '@angular/core';
import { ICartItem } from '../models/cart-item-model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ISaleItem } from '../models/sale-item-model';
import { SaleService } from '../services/sales.service';
import { ISale } from '../models/sale-model';
import { CommonModule } from '@angular/common';
import { MessageSaleService } from './message-sale.service';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment-timezone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-form-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-sale.component.html',
  styleUrl: './form-sale.component.css',
})
export class FormSaleComponent {
  @Input() items: ICartItem[] = [];
  saleForm!: FormGroup;
  showAddressField: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private saleService: SaleService,
    private messageSaleService: MessageSaleService,
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.saleForm = new FormGroup({
      buyer: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      withdraw: new FormControl<boolean | null>(null, [Validators.required]),
      paymentMethod: new FormControl<string>('', [Validators.required]),
      address: new FormControl<string | null>(null),
    });

    this.saleForm.get('withdraw')?.valueChanges.subscribe((value) => {
      this.showAddressField = value === 'false';
    });

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    if (this.isLoggedIn === true) {
      this.authService.profile().subscribe((profile) => {
        this.saleForm.get('buyer')?.setValue(profile.username);
      });
    }
  }

  showError() {
    this.toastr.error('Formulario invalido, complete los campos');
  }

  onSubmit(): void {
    if (this.saleForm.invalid) {
      this.showError();
      return;
    }

    const saleItems: ISaleItem[] = this.items.map((item) => ({
      productId: item.product.id as number,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.quantity * item.product.price,
    }));

    const total = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
    const argentinaDate = moment.tz('America/Montevideo').format();

    const sale: ISale = {
      buyer: this.saleForm.value.buyer,
      date: argentinaDate,
      withdraw: this.saleForm.value.withdraw,
      address: this.saleForm.value.address || '',
      paymentMethod: this.saleForm.value.paymentMethod,
      total: total,
      saleItems: saleItems,
    };

    this.saleService.doSale(sale).subscribe((reponse) => {
      console.log('resuesta de la venta', reponse);
    });

    const message = this.messageSaleService.generatePurchaseMessage(sale);
    const phoneNumber = '+543795384926';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
    this.cartService.clearCart();
    this.router.navigate(['/products']);
  }
}
