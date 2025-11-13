using Microsoft.EntityFrameworkCore;
using FaturamentoService.Models;

namespace FaturamentoService.Data
{
    public class FaturamentoContext : DbContext
    {
        public FaturamentoContext(DbContextOptions<FaturamentoContext> options) : base(options) { }

        public DbSet<NotaFiscal> NotasFiscais => Set<NotaFiscal>();
        public DbSet<ItemNota> ItensNota => Set<ItemNota>();
        public DbSet<IdempotencyRecord> IdempotencyRecords => Set<IdempotencyRecord>();
    }
}
