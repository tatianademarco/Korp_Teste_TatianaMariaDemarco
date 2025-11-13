import { Produto } from './produto';

export interface ItemNota {
  produtoId: number;
  produto?: Produto;
  quantidade: number;
}
