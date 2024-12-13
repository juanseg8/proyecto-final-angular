import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IProduct } from '../models/product-model';
import { ProductsService } from '../services/products.service';
import { ICategory } from '../models/categoty-model';
import { CategoriesService } from '../services/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, JsonPipe],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit {
  product?: IProduct | undefined;
  categories?: Array<ICategory>;

  form: FormGroup = new FormGroup({
    id: new FormControl<number | undefined>(undefined),
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    categoryId: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(0),
    ]),
    score: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(5),
    ]),
    imgUrl: new FormControl<string>(''),
    description: new FormControl<string>(''),
  });

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private toastr: ToastrService
  ) {}

  showSuccessPut() {
    this.toastr.success('Producto editado con exito');
  }

  showSuccessPost() {
    this.toastr.success('Producto creado con exito');
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    const categories$ = this.categoriesService.getCategories();

    if (Number(id) > 0) {
      this.productService
        .detailProduct(Number(id))
        .subscribe((product: IProduct) => {
          this.product = product;

          this.form.setValue({
            id: product.id,
            name: product.name,
            price: product.price,
            categoryId: product.categoryId,
            score: product.score,
            imgUrl: product.imgUrl,
            description: product.description,
          });
        });
    }

    categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.form.value.id) {
        console.log(this.form.value);
        this.productService
          .putProduct(this.form.value)
          .subscribe((product: IProduct) => {
            this.router.navigate(['/table-products']);
            this.showSuccessPut();
          });
      } else {
        this.productService
          .postProduct(this.form.value)
          .subscribe((product: IProduct) => {
            this.router.navigate(['/table-products']);
            this.showSuccessPost();
          });
      }
    }
  }

  onCancelar(): void {
    this.router.navigate(['/table-products']);
  }
}
