using Microsoft.AspNetCore.Mvc;
using EstoqueService.Data;
using EstoqueService.Models;
using EstoqueService.Dtos;
using Microsoft.EntityFrameworkCore;

namespace EstoqueService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly EstoqueContext _context;

    public ProdutosController(EstoqueContext context)
    {
        _context = context;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Produto>> GetProdutos() =>
            _context.Produtos.ToList();

    [HttpGet("{id}")]
    public ActionResult<Produto> GetProduto(int id)
    {
        var produto = _context.Produtos.Find(id);
        if (produto == null) return NotFound();
        return produto;
    }

    [HttpPost]
    public ActionResult<Produto> PostProduto(Produto produto)
    {
        _context.Produtos.Add(produto);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produto);
    }

    [HttpPut("{id}")]
    public IActionResult PutProduto(int id, Produto produto)
    {
        var existente = _context.Produtos.Find(id);
        if (existente == null) return NotFound();

        existente.Codigo = produto.Codigo;
        existente.Descricao = produto.Descricao;
        existente.Saldo = produto.Saldo;

        _context.SaveChanges();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteProduto(int id)
    {
        var existente = _context.Produtos.Find(id);
        if (existente == null) return NotFound();

        _context.Produtos.Remove(existente);

        _context.SaveChanges();
        return NoContent();
    }

    [HttpPost("baixar-estoque")]
    public async Task<IActionResult> BaixarEstoque([FromBody] List<ItemBaixaDto> itens)
    {
        foreach (var item in itens)
        {
            var produto = await _context.Produtos.FirstOrDefaultAsync(p => p.Id == item.ProdutoId);
            if (produto == null) continue;

            if (produto.Saldo < item.Quantidade)
                return BadRequest($"Saldo insuficiente para o produto {produto.Descricao}.");

            produto.Saldo -= item.Quantidade;
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict("O produto foi atualizado por outra nota. Tente novamente.");
        }

        return Ok("Estoque atualizado com sucesso.");
    }

    [HttpPost("estornar-estoque")]
    public async Task<IActionResult> EstornarEstoque([FromBody] List<ItemBaixaDto> itens)
    {
        foreach (var item in itens)
        {
            var produto = await _context.Produtos.FirstOrDefaultAsync(p => p.Id == item.ProdutoId);
            if (produto == null) continue;

            produto.Saldo += item.Quantidade;
        }

        await _context.SaveChangesAsync();
        return Ok("Estoque estornado com sucesso.");
    }
}
