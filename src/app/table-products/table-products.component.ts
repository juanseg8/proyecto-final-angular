import { Component } from '@angular/core';
import { IProduct } from '../models/product-model';
import { ProductsService } from '../services/products.service';
import { AuthService } from '../services/auth.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { combineLatest } from 'rxjs';
import { ICategory } from '../models/categoty-model';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-table-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './table-products.component.html',
  styleUrl: './table-products.component.css',
})
export class TableProductsComponent {
  products?: Array<IProduct>;
  categories?: Array<ICategory>;
  filteredProducts: Array<IProduct> = [];

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private alertService: AlertService
  ) {}

  showSuccessDelete() {
    this.toastr.success('Producto eliminado con exito');
  }

  ngOnInit(): void {
    const products$ = this.productsService.getProducts();
    const categories$ = this.categoriesService.getCategories();

    combineLatest([categories$, products$]).subscribe(
      ([categories, products]) => {
        this.categories = categories;
        this.products = products;
        this.filteredProducts = products;
      }
    );
  }

  getNameCategory(id: number): string {
    const category = this.categories?.find((c: ICategory) => c.id === id);
    return category ? category.name : 'No definida';
  }

  onDelete(productId: number): void {
    this.alertService.confirmDeleteProduct().then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(productId).subscribe({
          next: () => {
            this.alertService.success('Producto eliminado con éxito');
            this.products = this.products?.filter((p) => p.id !== productId);
          },
          error: () => {
            this.alertService.error('Error al eliminar el producto');
          },
        });
      } else {
        this.alertService.info('Eliminación cancelada');
      }
    });
  }
}
