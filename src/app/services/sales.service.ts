import { BehaviorSubject, Observable } from 'rxjs';
import { ISale } from '../models/sale-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly apiUrl = 'http://localhost:5004/api';
  public salesSubject = new BehaviorSubject<ISale[]>([]);
  public sales$ = this.salesSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  loadSales(): Observable<ISale[]> {
    return this.httpClient.get<ISale[]>(`${this.apiUrl}/Sales`);
  }

  doSale(sale: ISale): Observable<ISale> {
    return this.httpClient.post<ISale>(`${this.apiUrl}/Sales`, sale);
  }

  getSales(): Observable<ISale[]> {
    return this.sales$;
  }

  // Calcular las ventas de los últimos 7 días
  getSalesLast7Days(): Observable<any> {
    const today = new Date();

    // Inicializar los arreglos para los totales y las fechas, asegurándose de tener 7 días
    const dailySales = Array(7).fill(0);
    const salesDates = Array(7).fill('');

    // Recorrer los últimos 7 días (incluyendo hoy)
    for (let i = 0; i < 7; i++) {
      const dateLabel = new Date(today.getTime() - i * (24 * 60 * 60 * 1000));
      salesDates[i] = `${dateLabel.getDate()}/${dateLabel.getMonth() + 1}`;
    }

    // Filtrar las ventas de los últimos 7 días
    const last7DaysSales = this.salesSubject.getValue().filter((sale) => {
      const saleDate = new Date(sale.date);
      return today.getTime() - saleDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
    });

    // console.log('Ventas filtradas de los últimos 7 días:', last7DaysSales);

    // Iterar sobre las ventas filtradas
    for (const sale of last7DaysSales) {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - saleDate.getTime();
      const dayIndex = Math.floor(diffTime / (24 * 60 * 60 * 1000));

      if (dayIndex < 7) {
        dailySales[dayIndex] += sale.total;
      }
    }

    // console.log('Ventas diarias:', dailySales);
    // console.log('Fechas de ventas:', salesDates);

    return new Observable((observer) => {
      observer.next({ sales: dailySales, dates: salesDates });
      observer.complete();
    });
  }

  getSalesLast4Weeks(): Observable<any> {
    const today = new Date();

    // Asegúrate de que "today" sea solo la fecha sin horas
    today.setHours(0, 0, 0, 0);

    // Calcular el inicio de esta semana (asumiendo que lunes es el primer día)
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfCurrentWeek = new Date(
      today.getTime() - diffToMonday * 24 * 60 * 60 * 1000
    );

    // Calcular el inicio de las últimas 4 semanas
    const weekStarts: Date[] = [];
    for (let i = 0; i < 4; i++) {
      const startOfWeek = new Date(
        startOfCurrentWeek.getTime() - i * 7 * 24 * 60 * 60 * 1000
      );
      weekStarts.push(startOfWeek);
    }

    // Crear etiquetas para las semanas
    const weekLabels = weekStarts.map((startOfWeek) => {
      return `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1}`;
    });

    // Inicializar los totales para las semanas
    const weeklySales = Array(4).fill(0);

    // Filtrar las ventas de las últimas 4 semanas
    const last4WeeksSales = this.salesSubject.getValue().filter((sale) => {
      const saleDate = new Date(sale.date);
      return today.getTime() - saleDate.getTime() <= 28 * 24 * 60 * 60 * 1000;
    });

    // console.log('Ventas filtradas de las últimas 4 semanas:', last4WeeksSales);

    // Iterar sobre las ventas filtradas
    for (const sale of last4WeeksSales) {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - saleDate.getTime();
      const dayIndex = Math.floor(diffTime / (24 * 60 * 60 * 1000));
      const weekIndex = Math.floor(dayIndex / 7);

      if (weekIndex < 4) {
        weeklySales[weekIndex] += sale.total;
      }
    }

    // console.log('Ventas semanales:', weeklySales);

    return new Observable((observer) => {
      observer.next({
        sales: weeklySales,
        dates: weekLabels,
      });
      observer.complete();
    });
  }
}
