using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;
using MediatR;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotNetEnv.Env.Load();

var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");

if (string.IsNullOrWhiteSpace(frontendUrl))
{
    throw new InvalidOperationException("FrontendUrl environment variable is not set.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddScoped<IFirebaseAuthService, FirebaseAuthService>();
builder.Services.AddScoped<IFirestoreService, FirestoreService>();

builder.Services.AddHostedService<SelfPingHostedService>();

// Register MediatR for the Application project assembly where handlers live
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(Assembly.Load("CouplesGames.Application"))
);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();
app.Run();
