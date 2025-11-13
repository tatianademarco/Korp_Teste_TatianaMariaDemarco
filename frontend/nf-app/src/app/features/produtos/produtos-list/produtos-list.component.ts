import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../../../core/models/produto';
import { ProdutoFormComponent } from '../produto-form/produto-form.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-produtos-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    MatProgressBarModule],
  templateUrl: './produtos-list.component.html',
  styleUrl: './produtos-list.component.css'
})
export class ProdutosListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'codigo', 'nome', 'quantidade', 'acoes'];
  produtos: Produto[] = [];
  loading = false;

  constructor(private produtoService: ProdutoService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.loading = true;

    this.produtoService.getAll().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (data) => {
        this.produtos = data;
      },
      error: (err) => {
      },
    });
  }

  novoProduto() {
    const dialogRef = this.dialog.open(ProdutoFormComponent, { width: '400px', height: '430px', data: null });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.carregarProdutos();
    });
  }

  editarProduto(produto: Produto) {
    const dialogRef = this.dialog.open(ProdutoFormComponent, { width: '400px', height: '430px', data: produto });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.carregarProdutos();
    });
  }

  excluirProduto(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.loading = true;
      this.produtoService.delete(id).pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: () => {
          this.carregarProdutos()
        },
        error: (err) => {
          console.error('Erro ao excluir produto:', err);
        }
      });
    }
  }
}
