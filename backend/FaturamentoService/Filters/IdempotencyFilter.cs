using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using FaturamentoService.Data;
using FaturamentoService.Models;

namespace FaturamentoService.Filters
{
    public class IdempotencyFilter : IAsyncActionFilter
    {
        private readonly AppDbContext _context;

        public IdempotencyFilter(AppDbContext context)
        {
            _context = context;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.HttpContext.Request.Headers.TryGetValue("Idempotency-Key", out var key))
            {
                await next();
                return;
            }

            var endpoint = context.ActionDescriptor.DisplayName ?? "unknown";

            var exists = await _context.IdempotencyRecords
                .AnyAsync(r => r.Key == key && r.Endpoint == endpoint);

            if (exists)
            {
                context.Result = new ConflictObjectResult("Esta operação já foi processada anteriormente.");
                return;
            }

            await next();

            _context.IdempotencyRecords.Add(new IdempotencyRecord
            {
                Key = key,
                Endpoint = endpoint
            });

            await _context.SaveChangesAsync();
        }
    }
}
