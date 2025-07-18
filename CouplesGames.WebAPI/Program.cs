using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;
using MediatR;
using System.Reflection;
using CouplesGames.WebAPI.Hubs;

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
              .AllowAnyMethod()
              .AllowCredentials();
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

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.MaximumReceiveMessageSize = 102400; // 100 KB
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// Correct middleware ordering
app.UseCors("AllowFrontend"); // CORS needs to be before routing for SignalR
app.UseRouting();
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapHub<GameHub>("/gameHub");
app.MapControllers();

app.Run();
