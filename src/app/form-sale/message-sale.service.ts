import { Injectable } from '@angular/core';
import { ISale } from '../models/sale-model';
import { ProductsService } from '../services/products.service';
import { IProduct } from '../models/product-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageSaleService {
  private productsSubject = new BehaviorSubject<IProduct[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private productsService: ProductsService) {
    this.productsService.getProducts().subscribe((products) => {
      this.productsSubject.next(products);
    });
  }

  getProductName(id: number): string | undefined {
    const product = this.productsSubject.getValue().find((p) => p.id === id);
    return product?.name;
  }

  generatePurchaseMessage(sale: ISale): string {
    const saleItemsText = sale.saleItems
      .map((item) => {
        const productName =
          this.getProductName(item.productId) || 'Producto desconocido';
        return `    - ${item.quantity} x ${productName}`;
      })
      .join('\n');

    let withdraw = '';
    let paymentMethod = '';

    if (sale.withdraw === 'false') {
      withdraw = 'no';
    } else {
      withdraw = 'si';
    }

    if (sale.paymentMethod === 'cash') {
      paymentMethod = 'efectivo';
    } else if (sale.paymentMethod === 'transfer') {
      paymentMethod = 'transferencia';
    } else {
      paymentMethod = 'tarjeta';
    }

    const addressText =
      sale.withdraw === 'false'
        ? `\n      Dirección: ${sale.address || 'No proporcionada'}`
        : '';

    const deliveryText =
      sale.withdraw === 'false' ? `\nCONSULTAR PRECIO DE ENVIO` : '';

    const transferText =
      sale.paymentMethod === 'transfer'
        ? `
TRANSFERIR Y ENVIAR COMPROBANTE:\n
      ALIAS: Ungusto.ctes
      NOMBRE: Alejandro Monteros`
        : '';

    return `
¡Hola! Quiero confirmar mi compra:

      Comprador: ${sale.buyer}
      Fecha: ${sale.date.toLocaleString()}
      Retira: ${withdraw}${addressText}
      Método de Pago: ${paymentMethod}
      Total: $${sale.total.toFixed(2)}

Detalles de los productos:\n
${saleItemsText}

${transferText}
${deliveryText}    
      `;
  }
}
