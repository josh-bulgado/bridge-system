# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Copy csproj and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Install libgdiplus for System.Drawing (needed for document generation with QuestPDF and FreeSpire)
RUN apt-get update && \
    apt-get install -y libgdiplus libc6-dev && \
    ln -s /usr/lib/libgdiplus.so /lib/x86_64-linux-gnu/libgdiplus.so && \
    rm -rf /var/lib/apt/lists/*

# Copy built app
COPY --from=build /app .

# Expose port (Render uses PORT env variable)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "server.dll"]
