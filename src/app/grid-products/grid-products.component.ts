import { Component } from '@angular/core';
import { IProduct } from '../models/product-model';
import { ProductsService } from '../services/products.service';
import { CommonModule } from '@angular/common';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { CardProductsComponent } from './card-products/card-products.component';

@Component({
  selector: 'app-grid-products',
  standalone: true,
  imports: [CommonModule, ProductSearchComponent, CardProductsComponent],
  templateUrl: './grid-products.component.html',
  styleUrl: './grid-products.component.css',
})
export class GridProductsComponent {
  products: Array<IProduct> = [];
  filteredProducts: Array<IProduct> = [];

  constructor(private productsService: ProductsService) {}
  ngOnInit(): void {
    const products$ = this.productsService.getProducts();

    products$.subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  onFilteredProductsChange(filteredProducts: IProduct[]): void {
    this.filteredProducts = filteredProducts;
  }
}
