using CouplesGames.Core.Configuration;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;
using MediatR;
using System.Reflection;
using CouplesGames.WebAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotNetEnv.Env.Load();

// Configure strongly typed settings
builder.Services.Configure<FirebaseSettings>(options =>
{
    options.ProjectId = Environment.GetEnvironmentVariable("FIREBASE_PROJECT_ID") ??
        builder.Configuration.GetValue<string>("Firebase:ProjectId") ?? "";
    options.ServiceAccountJsonBase64 = Environment.GetEnvironmentVariable("FIREBASE_SERVICE_ACCOUNT_JSON_BASE64") ??
        builder.Configuration.GetValue<string>("Firebase:ServiceAccountJsonBase64") ?? "";
});

builder.Services.Configure<FrontendSettings>(options =>
{
    options.Url = Environment.GetEnvironmentVariable("FRONTEND_URL") ??
        builder.Configuration.GetValue<string>("Frontend:Url") ?? "";
});

// Validate required configuration
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ??
    builder.Configuration.GetValue<string>("Frontend:Url") ?? "";
if (string.IsNullOrWhiteSpace(frontendUrl))
{
    throw new InvalidOperationException("Frontend URL is not configured");
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
builder.Services.AddHttpClient();
builder.Services.AddSingleton<IFirebaseAuthService, FirebaseAuthService>();
builder.Services.AddSingleton<IFirestoreService, FirestoreService>();

// Conditionally register SelfPingHostedService based on environment variable
var enableSelfPing = Environment.GetEnvironmentVariable("ENABLE_SELF_PING")
                     ?? builder.Configuration.GetValue<string>("EnableSelfPing")
                     ?? "false";

if (enableSelfPing.Equals("true", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddHostedService<SelfPingHostedService>();
}

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseRouting();
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapHub<GameHub>("/gameHub");
app.MapControllers();

app.Run();
