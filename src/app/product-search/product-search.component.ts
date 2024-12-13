import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ICategory } from '../models/categoty-model';
import { CategoriesService } from '../services/categories.service';
import { IProduct } from '../models/product-model';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css',
})
export class ProductSearchComponent implements OnInit {
  @Input() products!: Array<IProduct>;
  @Output() filteredProductsChange = new EventEmitter<Array<IProduct>>();
  categories?: Array<ICategory>;
  filteredCategories: Array<ICategory> = [];

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((response) => {
      this.categories = response;
    });
    this.emitAllProducts();
  }

  emitAllProducts(): void {
    this.filteredProductsChange.emit(this.products);
  }

  onCategoryChange(category: ICategory | null): void {
    if (category === null) {
      this.filteredCategories = [];
    } else if (this.isSelected(category)) {
      this.filteredCategories = this.filteredCategories.filter(
        (c) => c.id !== category.id
      );
    } else {
      this.filteredCategories.push(category);
    }

    // Filtra los productos en función de las categorías seleccionadas
    const filteredProducts = this.products.filter((product) =>
      this.filteredCategories.length === 0
        ? true
        : this.filteredCategories.some(
            (selectedCategory) => product.categoryId === selectedCategory.id
          )
    );

    // Emitir los productos filtrados
    this.filteredProductsChange.emit(filteredProducts);
  }

  isSelected(category: ICategory): boolean {
    return this.filteredCategories.includes(category);
  }
}
