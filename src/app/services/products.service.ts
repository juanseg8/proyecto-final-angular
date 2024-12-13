import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product-model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = 'http://localhost:5004/api';
  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<Array<IProduct>> {
    return this.httpClient.get<Array<IProduct>>(`${this.apiUrl}/Products`);
  }

  detailProduct(id: number): Observable<IProduct> {
    return this.httpClient.get<IProduct>(`${this.apiUrl}/Products/${id}`);
  }

  postProduct(product: IProduct): Observable<IProduct> {
    return this.httpClient.post<IProduct>(`${this.apiUrl}/Products`, product);
  }

  putProduct(product: IProduct): Observable<IProduct> {
    return this.httpClient.put<IProduct>(
      `${this.apiUrl}/Products/${product.id}`,
      product
    );
  }

  deleteProduct(id: number): Observable<IProduct> {
    return this.httpClient.delete<IProduct>(`${this.apiUrl}/Products/${id}`);
  }
}
