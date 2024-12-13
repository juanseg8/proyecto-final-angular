import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ICategory } from '../models/categoty-model';
import { CategoriesService } from '../services/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent implements OnInit {
  category?: ICategory | undefined;

  form: FormGroup = new FormGroup({
    id: new FormControl<number | undefined>(undefined),
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  showSuccessPut() {
    this.toastr.success('Categoria editado con exito');
  }

  showSuccessPost() {
    this.toastr.success('Categoria creado con exito');
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (Number(id) > 0) {
      this.categoriesService
        .detailCategory(Number(id))
        .subscribe((category: ICategory) => {
          this.category = category;

          this.form.setValue({
            id: category.id,
            name: category.name,
          });
        });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.form.value.id) {
        this.categoriesService
          .putCategory(this.form.value)
          .subscribe((category: ICategory) => {
            this.router.navigate(['/table-categories']);
            this.showSuccessPut();
          });
      } else {
        this.categoriesService
          .postCategory(this.form.value)
          .subscribe((category: ICategory) => {
            this.router.navigate(['/table-categories']);
            this.showSuccessPost();
          });
      }
    }
  }

  onCancelar(): void {
    this.router.navigate(['/table-categories']);
  }
}
