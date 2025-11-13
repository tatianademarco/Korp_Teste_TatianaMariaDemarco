import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../../../core/models/produto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-produto-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.css'
})
export class ProdutoFormComponent implements OnInit {
  form!: FormGroup;
  isSaving = false;
  private snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private dialogRef: MatDialogRef<ProdutoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Produto | null
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      saldo: [0, [Validators.required, Validators.min(0)]],
    });

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  salvar() {
    if (this.form.invalid) return;
    
    this.isSaving = true;

    const produto = this.form.value as Produto;

    const request = this.data?.id
      ? this.produtoService.update(this.data?.id, produto)
      : this.produtoService.create(produto);

    request.pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Produto salvo com sucesso!', 'Fechar',
          {
        duration: 4000
      }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erro ao salvar produto:', err);
      }
    });
  }

  fechar() {
    this.dialogRef.close();
  }
}
