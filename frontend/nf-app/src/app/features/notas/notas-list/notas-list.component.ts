import { Component, inject, OnInit } from '@angular/core';
import { NotaService } from '../services/nota.service';
import { NotaFiscal } from '../../../core/models/nota-fiscal';
import { MatDialog } from '@angular/material/dialog';
import { NotaFormComponent } from '../nota-form/nota-form.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-notas-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule],
  templateUrl: './notas-list.component.html',
  styleUrl: './notas-list.component.css'
})
export class NotasListComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'status', 'acoes'];
  notas: NotaFiscal[] = [];
  loading = false;
  private snackBar = inject(MatSnackBar);

  constructor(private service: NotaService, private dialog: MatDialog) { }

  ngOnInit() {
    this.carregarNotas();
  }

  carregarNotas() {
    this.loading = true;

    this.service.getAll().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (dados) => {
        this.notas = dados;
      },
      error: (err) => {
      },
    });
  }

  novaNota() {
    const dialogRef = this.dialog.open(NotaFormComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((salvou) => {
      if (salvou) this.carregarNotas();
    });
  }

  imprimirNota(nota: NotaFiscal) {
    if (nota.status !== 'Aberta') {
      alert('Apenas notas abertas podem ser impressas.');
      return;
    }

    this.loading = true;
    this.service.fecharNota(nota.id!).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Nota impressa e fechada com sucesso!', 'Fechar', {
        duration: 4000
      });
        this.carregarNotas();
      },
      error: (err) => {
      },
    });
  }
}
