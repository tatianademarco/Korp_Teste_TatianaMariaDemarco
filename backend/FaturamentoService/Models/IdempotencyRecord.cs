namespace FaturamentoService.Models
{
    public class IdempotencyRecord
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
