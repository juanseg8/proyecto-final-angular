import ApexCharts from 'apexcharts';
import { Component, OnInit } from '@angular/core';
import { SaleService } from '../services/sales.service';
import { CommonModule, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css'],
})
export class SalesChartComponent implements OnInit {
  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.saleService.loadSales().subscribe({
      next: (sales) => {
        this.saleService.salesSubject.next(sales);
        console.log('Ventas cargadas:', sales);
        this.updateChartWeek();
        this.updateChartMonth();
      },
      error: (error) => {
        console.error('Error al cargar las ventas', error);
      },
      complete: () => {
        console.log('Carga de ventas completada');
      },
    });
  }

  updateChartMonth(): void {
    this.saleService.getSalesLast4Weeks().subscribe(({ sales, dates }) => {
      const data = sales;
      const xAxisCategories = dates;

      console.log('data month', data);
      console.log('xAxisCategories month', xAxisCategories);

      const chartMonth = {
        colors: ['#28A745', '#FFC107'],
        series: [
          {
            name: 'Ventas',
            data: data.reverse(),
          },
        ],
        chart: {
          type: 'bar',
          height: '320px',
          fontFamily: 'Inter, sans-serif',
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        markers: {
          size: 4,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: xAxisCategories.reverse(),
          labels: {
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          labels: {
            formatter: (val: number) =>
              new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
              }).format(val),
            style: {
              fontSize: '12px',
            },
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: (val: number) =>
              new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
              }).format(val),
          },
        },
      };

      if (document.getElementById('month-chart')) {
        const chart = new ApexCharts(
          document.getElementById('month-chart'),
          chartMonth
        );
        chart.render();
      }
    });
  }

  updateChartWeek(): void {
    this.saleService.getSalesLast7Days().subscribe(({ sales, dates }) => {
      const data = sales;
      const xAxisCategories = dates;

      console.log('data week', data);
      console.log('xAxisCategories week', xAxisCategories);

      const chartWeek = {
        colors: ['#28A745', '#FFC107'],
        series: [
          {
            name: 'Ventas',
            data: data.reverse(),
          },
        ],
        chart: {
          type: 'bar',
          height: '320px',
          fontFamily: 'Inter, sans-serif',
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        markers: {
          size: 4,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: xAxisCategories.reverse(),
          labels: {
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          labels: {
            formatter: (val: number) =>
              new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
              }).format(val),
            style: {
              fontSize: '12px',
            },
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: (val: number) =>
              new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
              }).format(val),
          },
        },
      };

      if (document.getElementById('week-chart')) {
        const chart = new ApexCharts(
          document.getElementById('week-chart'),
          chartWeek
        );
        chart.render();
      }
    });
  }
}
