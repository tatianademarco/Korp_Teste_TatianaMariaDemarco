namespace FaturamentoService.Models
{
    public class NotaFiscal
    {
        public int Id { get; set; }
        public int Numero { get; set; }
        public string Status { get; set; } = "Aberta";
        public List<ItemNota> Itens { get; set; } = new();
    }

    public class ItemNota
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }
    }
}
