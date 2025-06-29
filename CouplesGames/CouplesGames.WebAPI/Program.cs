using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;
using CouplesGames.Application.UseCases;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotNetEnv.Env.Load();

// Add services to the container.
builder.Services.AddScoped<IFirebaseAuthService, FirebaseAuthService>();
builder.Services.AddScoped<IFirestoreService, FirestoreService>();
builder.Services.AddScoped<CreateRoomUseCase>();
builder.Services.AddScoped<JoinRoomUseCase>();
builder.Services.AddHostedService<SelfPingHostedService>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
