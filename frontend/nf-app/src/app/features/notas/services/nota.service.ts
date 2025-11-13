import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaFiscal } from '../../../core/models/nota-fiscal';

const headers = {
  'Idempotency-Key': crypto.randomUUID(),
};

@Injectable({
  providedIn: 'root'
})

export class NotaService {
  private apiUrl = 'https://localhost:7142/api/NotasFiscais';
  constructor(private http: HttpClient) { }

  getAll(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.apiUrl);
  }

  create(nota: Partial<NotaFiscal>): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(this.apiUrl, nota);
  }

  fecharNota(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/fechar`, {}, { headers });
  }
}
