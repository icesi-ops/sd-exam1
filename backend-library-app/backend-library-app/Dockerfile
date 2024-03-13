#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 5087
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["backend-library-app/backend-library-app.csproj", "backend-library-app/"]
RUN dotnet restore "./backend-library-app/backend-library-app.csproj"
COPY . .
WORKDIR "/src/backend-library-app"
RUN dotnet build "./backend-library-app.csproj" -c $BUILD_CONFIGURATION -o /app/build

RUN chmod 777 /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./backend-library-app.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend-library-app.dll"]