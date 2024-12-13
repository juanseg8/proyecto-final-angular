import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../models/categoty-model';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly apiUrl = 'http://localhost:5004/api';
  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<Array<ICategory>> {
    return this.httpClient.get<Array<ICategory>>(`${this.apiUrl}/Categories`);
  }

  detailCategory(id: number): Observable<ICategory> {
    return this.httpClient.get<ICategory>(`${this.apiUrl}/Categories/${id}`);
  }

  postCategory(category: ICategory): Observable<ICategory> {
    return this.httpClient.post<ICategory>(
      `${this.apiUrl}/Categories`,
      category
    );
  }

  putCategory(category: ICategory): Observable<ICategory> {
    return this.httpClient.put<ICategory>(
      `${this.apiUrl}/Categories/${category.id}`,
      category
    );
  }

  deleteProduct(id: number): Observable<ICategory> {
    return this.httpClient.delete<ICategory>(`${this.apiUrl}/Categories/${id}`);
  }
}
