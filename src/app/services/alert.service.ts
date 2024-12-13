import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  confirmDeleteProduct(
    message: string = '¿Estás seguro de eliminar este producto?'
  ) {
    return Swal.fire({
      title: 'Confirmación',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  }

  confirmDeleteCategory(
    message: string = '¿Estás seguro de eliminar esta categoria?'
  ) {
    return Swal.fire({
      title: 'Confirmación',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  }

  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
    });
  }

  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  info(message: string) {
    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: message,
    });
  }
}
