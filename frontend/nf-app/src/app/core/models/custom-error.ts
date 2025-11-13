import { HttpErrorResponse } from '@angular/common/http';

export interface CustomError {
    originalError: HttpErrorResponse;
    serviceName: string;
    httpStatus: number;
    message: any;
}
