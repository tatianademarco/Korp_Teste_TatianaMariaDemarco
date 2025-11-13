using Microsoft.EntityFrameworkCore;
using FaturamentoService.Data;
using Polly;
using Polly.Extensions.Http;
using FaturamentoService.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<FaturamentoContext>(options =>
    options.UseInMemoryDatabase("FaturamentoDB"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") // origem do Angular
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddHttpClient("EstoqueService", client =>
{
    client.BaseAddress = new Uri("http://localhost:5245");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
})
.AddPolicyHandler(GetRetryPolicy())
.AddPolicyHandler(GetCircuitBreakerPolicy());

static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
            onRetry: (outcome, timespan, retryAttempt, context) =>
            {
                Console.WriteLine($"Tentativa {retryAttempt} falhou. Re-tentando em {timespan.TotalSeconds}s");
            });
}

static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .CircuitBreakerAsync(
            handledEventsAllowedBeforeBreaking: 3,
            durationOfBreak: TimeSpan.FromSeconds(15),
            onBreak: (outcome, breakDelay) =>
            {
                Console.WriteLine($"Circuit breaker acionado por {breakDelay.TotalSeconds}s");
            },
            onReset: () => Console.WriteLine("Circuit breaker resetado."),
            onHalfOpen: () => Console.WriteLine("Circuit breaker em meio-aberto, próxima tentativa será testada.")
        );
}

builder.Services.AddScoped<IdempotencyFilter>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<IdempotencyFilter>();
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAngular");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
