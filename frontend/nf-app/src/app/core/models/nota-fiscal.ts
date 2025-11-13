import { ItemNota } from './item-nota';
export interface NotaFiscal {
  id: number;
  numero: number;
  status: 'Aberta' | 'Fechada';
  itens: ItemNota[];
}
