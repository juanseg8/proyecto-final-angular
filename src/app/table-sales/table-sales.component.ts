import { Component, Pipe } from '@angular/core';
import { SaleService } from '../services/sales.service';
import { ISale } from '../models/sale-model';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { IProduct } from '../models/product-model';
import { MessageSaleService } from '../form-sale/message-sale.service';
import { SalesChartComponent } from '../sales-chart/sales-chart.component';

@Component({
  selector: 'app-table-sales',
  standalone: true,
  imports: [CommonModule, SalesChartComponent],
  templateUrl: './table-sales.component.html',
  styleUrl: './table-sales.component.css',
})
export class TableSalesComponent {
  sales?: Array<ISale>;
  products: Array<IProduct> = [];
  saleItemsText?: String;

  constructor(
    private salesService: SaleService,
    private productsService: ProductsService,
    private messageSaleService: MessageSaleService
  ) {}

  ngOnInit(): void {
    const sales$ = this.salesService.getSales();

    sales$.subscribe((sales) => {
      this.sales = sales;
    });

    const products$ = this.productsService.getProducts();

    products$.subscribe((products) => {
      this.products = products;
    });
  }

  getProducts(sale: ISale): string {
    return sale.saleItems
      .map((item) => {
        const productName =
          this.messageSaleService.getProductName(item.productId) ||
          'Producto desconocido';
        return ` ${item.quantity} x ${productName}`;
      })
      .join('\n');
  }

  traduceMethodPayment(methodPayment: string): string {
    if (methodPayment === 'transfer') {
      return 'Transferencia';
    } else if (methodPayment === 'cash') {
      return 'Efectivo';
    } else {
      return 'Tarjeta';
    }
  }
}
