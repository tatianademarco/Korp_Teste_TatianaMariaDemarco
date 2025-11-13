import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomError } from '../models/custom-error';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private snackBar: MatSnackBar) { }

  public handleError(error: CustomError): void {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    let isCritical = false;

    if (error.originalError instanceof ErrorEvent) {
      errorMessage = `Erro de Rede/Cliente: ${error.message}`;
    } else {

      console.error(`Status HTTP: ${error.httpStatus}`, error.originalError);

      if (error.httpStatus === 500 && error.message?.includes('Falha Crítica')) {
        isCritical = true;
        errorMessage = error.message;
      }
      else {

        switch (error.httpStatus) {
          case 0:
            errorMessage = `A conexão com o ${error.serviceName} falhou. Verifique se o serviço está em execução ou se há um problema de CORS/Rede.`;
            break;
          case 503:
            errorMessage = `Falha crítica: O Serviço ${error.serviceName} está indisponível. Tente mais tarde.`;
            break;
          default:
            errorMessage = error.originalError.error || error.message || `Erro do Servidor (Status ${error.httpStatus}).`;
            break;
        }
      }
    }

    if (isCritical) {
      alert(errorMessage);
    } else {
      this.snackBar.open(errorMessage, 'Fechar', {
        duration: 7000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
