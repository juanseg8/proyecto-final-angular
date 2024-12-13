import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TableProductsComponent } from './table-products/table-products.component';
import { TableCategoriesComponent } from './table-categories/table-categories.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { adminGuard } from './admin.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { GridProductsComponent } from './grid-products/grid-products.component';
import { TableSalesComponent } from './table-sales/table-sales.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: GridProductsComponent,
      },
      {
        path: ':id/edit',
        component: ProductEditComponent,
      },
      {
        path: 'new',
        component: ProductEditComponent,
      },
    ],
  },
  {
    path: 'table-products',
    component: TableProductsComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'categories',
    children: [
      {
        path: ':id/edit',
        component: CategoryEditComponent,
      },
      {
        path: 'new',
        component: CategoryEditComponent,
      },
    ],
  },
  {
    path: 'table-categories',
    component: TableCategoriesComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'table-sales',
    component: TableSalesComponent,
    canActivate: [adminGuard],
  },
  { path: 'cart', component: CartComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];
