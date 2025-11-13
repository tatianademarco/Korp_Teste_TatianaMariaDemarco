import { Component, OnInit, inject, ViewChild, Inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { finalize } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

import { ProdutoService } from '../../produtos/services/produto.service';
import { NotaService } from '../services/nota.service';
import { Produto } from '../../../core/models/produto';
import { NotaFiscal } from '../../../core/models/nota-fiscal';
import { CustomError } from '../../../core/models/custom-error';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-nota-form',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatProgressBarModule
  ],
  templateUrl: './nota-form.component.html',
  styleUrl: './nota-form.component.css'
})
export class NotaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private produtoService = inject(ProdutoService);
  private notaService = inject(NotaService);
  private router = inject(Router);

  @ViewChild(MatTable) itensTable!: MatTable<any>;

  form!: FormGroup;
  produtos: Produto[] = [];
  loading = false;

  displayedColumns = ['produto', 'quantidade', 'acoes'];

    constructor(
    private dialogRef: MatDialogRef<NotaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotaFiscal | null
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.form = this.fb.group({
      numero: [{ value: '', disabled: true }],
      status: [{ value: 'Aberta', disabled: true }],
      itens: this.fb.array([])
    });

    this.produtoService.getAll().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => (this.produtos = res),
      error: (err) => {console.error('Erro ao buscar produtos:', err)
      },
    });
  }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  adicionarItem() {
    const itemForm = this.fb.group({
      produtoId: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });
    this.itens.push(itemForm);

    if (this.itensTable) {
    this.itensTable.renderRows();
  }
  }

  removerItem(index: number) {
    this.itens.removeAt(index);

        if (this.itensTable) {
    this.itensTable.renderRows();
  }
  }

  salvar() {
    if (this.form.invalid || this.itens.length === 0 || this.loading) return;

    this.loading = true;

    const nota: Partial<NotaFiscal> = {
      status: 'Aberta',
      itens: this.itens.getRawValue()
    };

    this.notaService.create(nota).pipe(
    finalize(() => {
      this.loading = false;
    })
  ).subscribe({
    next: () => {
      this.snackBar.open('Nota criada com sucesso!', 'Fechar', {
        duration: 4000,
      }); 
      this.dialogRef.close(true);
    },
    error: (err: CustomError) => {
      console.error('Erro ao salvar nota:', err);
    }
  });
  }

    fechar() {
    this.dialogRef.close();
  }
}
