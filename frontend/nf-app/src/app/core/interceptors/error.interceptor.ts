import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';
import { CustomError } from '../models/custom-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandlerService = inject(ErrorHandlerService);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {
      
      const url = req.url;
      let serviceName = 'Serviço Desconhecido';

      if (url.includes('/api/Produtos')) {
        serviceName = 'Serviço de Estoque (Produtos)';
      } else if (url.includes('/api/NotasFiscais')) {
        serviceName = 'Serviço de Faturamento (Notas Fiscais)';
      }
      
      const customError: CustomError = {
        originalError: error,
        serviceName: serviceName,
        httpStatus: error.status,
        message: error.error?.message || error.message,
      };

      errorHandlerService.handleError(customError);

      return throwError(() => customError);
    })
  );
};
