# ===============================================
# Stage 1: Build
# ===============================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and restore dependencies
COPY ["CouplesGamesApi.sln", "./"]
COPY ["CouplesGamesApi.Core/CouplesGamesApi.Core.csproj", "CouplesGamesApi.Core/"]
COPY ["CouplesGamesApi.Application/CouplesGamesApi.Application.csproj", "CouplesGamesApi.Application/"]
COPY ["CouplesGamesApi.Infrastructure/CouplesGamesApi.Infrastructure.csproj", "CouplesGamesApi.Infrastructure/"]
COPY ["CouplesGamesApi/CouplesGamesApi.csproj", "CouplesGamesApi/"]

RUN dotnet restore

# Copy the entire source and build the app
COPY . . 
WORKDIR "/src/CouplesGamesApi"
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

ENTRYPOINT ["dotnet", "CouplesGamesApi.dll"]
