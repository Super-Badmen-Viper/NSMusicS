#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Directory.Build.props", "."]
COPY ["NSMusicS_For_Blazor/NSMusicS_For_Blazor.csproj", "NSMusicS_For_Blazor/"]
RUN dotnet restore "NSMusicS_For_Blazor/NSMusicS_For_Blazor.csproj"
COPY . .
WORKDIR "/src/NSMusicS_For_Blazor"
RUN dotnet build "NSMusicS_For_Blazor.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NSMusicS_For_Blazor.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NSMusicS_For_Blazor.dll"]