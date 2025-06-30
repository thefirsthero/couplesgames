# ===============================================
# Stage 1: Build
# ===============================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and restore dependencies
COPY ["CouplesGames.sln", "./"]
COPY ["CouplesGames.Core/CouplesGames.Core.csproj", "CouplesGames.Core/"]
COPY ["CouplesGames.Application/CouplesGames.Application.csproj", "CouplesGames.Application/"]
COPY ["CouplesGames.Infrastructure/CouplesGames.Infrastructure.csproj", "CouplesGames.Infrastructure/"]
COPY ["CouplesGames.Tests/CouplesGames.Tests.csproj", "CouplesGames.Tests/"]
COPY ["CouplesGames.WebAPI/CouplesGames.WebAPI.csproj", "CouplesGames.WebAPI/"]
COPY ["CouplesGames.UI/CouplesGames.UI.esproj", "CouplesGames.UI/"]

RUN dotnet restore

# Copy the entire source and build the app
COPY . . 
WORKDIR "/src/CouplesGames.WebAPI"
RUN dotnet publish -c Release -o /app/publish

# ===============================================
# Stage 2: Runtime
# ===============================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published app from build stage
COPY --from=build /app/publish .

# Expose port (optional, Render auto detects ASP.NET ports)
EXPOSE 8080

# Set environment variables if needed (override on Render)
# ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "CouplesGames.WebAPI.dll"]
