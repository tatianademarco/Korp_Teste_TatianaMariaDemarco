using FaturamentoService.Data;
using FaturamentoService.Filters;
using FaturamentoService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FaturamentoService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotasFiscaisController : ControllerBase
{
    private readonly FaturamentoContext _context;
    private readonly IHttpClientFactory _httpClientFactory;

    public NotasFiscaisController(FaturamentoContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotaFiscal>>> GetNotas()
    {
        return await _context.NotasFiscais.Include(n => n.Itens).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NotaFiscal>> GetNota(int id)
    {
        var nota = await _context.NotasFiscais.Include(n => n.Itens)
                                              .FirstOrDefaultAsync(n => n.Id == id);

        if (nota == null) return NotFound();
        return nota;
    }

    [HttpPost]
    public async Task<ActionResult<NotaFiscal>> CriarNota(NotaFiscal nota)
    {
        nota.Numero = _context.NotasFiscais.Count() + 1;
        nota.Status = "Aberta";

        _context.NotasFiscais.Add(nota);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNota), new { id = nota.Id }, nota);
    }

    [ServiceFilter(typeof(IdempotencyFilter))]
    [HttpPost("{id}/fechar")]
    public async Task<IActionResult> FecharNota(int id)
    {
        var nota = await _context.NotasFiscais.Include(n => n.Itens).FirstOrDefaultAsync(n => n.Id == id);
        if (nota == null) return NotFound();

        if (nota.Status != "Aberta")
            return BadRequest("A nota já está fechada.");

        // envia requisição para EstoqueService para baixar o estoque
        var http = _httpClientFactory.CreateClient("EstoqueService");

        var resposta = await http.PostAsJsonAsync("/api/produtos/baixar-estoque", nota.Itens);

        if (!resposta.IsSuccessStatusCode)
        {
            var erroDetalhado = await resposta.Content.ReadAsStringAsync();
            return StatusCode((int)resposta.StatusCode, $"Falha ao atualizar estoque: {erroDetalhado}");
        }

        try
        {
            nota.Status = "Fechada";
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            var respostaCompensacao = await http.PostAsJsonAsync("/api/produtos/estornar-estoque", nota.Itens);

            if (!respostaCompensacao.IsSuccessStatusCode)
            {
                return StatusCode(500, "Falha Crítica: Nota não fechada e Estorno de Estoque falhou. Contate o suporte.");
            }

            return StatusCode(500, $"Falha de Banco de Dados: Não foi possível fechar a Nota Fiscal. Por favor, tente novamente.");
        }
    }
}

