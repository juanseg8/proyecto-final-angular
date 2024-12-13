import { Component } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { ICategory } from '../models/categoty-model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './table-categories.component.html',
  styleUrl: './table-categories.component.css',
})
export class TableCategoriesComponent {
  categories?: Array<ICategory>;

  constructor(
    private categoriesService: CategoriesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const categories$ = this.categoriesService.getCategories();

    categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }

  onDelete(categoryId: number): void {
    this.alertService.confirmDeleteCategory().then((result) => {
      if (result.isConfirmed) {
        this.categoriesService.deleteProduct(categoryId).subscribe({
          next: () => {
            this.alertService.success('Categoria eliminado con éxito');
            this.categories = this.categories?.filter(
              (c) => c.id !== categoryId
            );
          },
          error: () => {
            this.alertService.error('Error al eliminar la categoria');
          },
        });
      } else {
        this.alertService.info('Eliminación cancelada');
      }
    });
  }
}
