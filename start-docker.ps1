# Save as start-docker.ps1

# Elevate to admin if needed
If (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# Docker Desktop paths
$dockerPaths = @(
    "C:\Program Files\Docker\Docker\Docker Desktop.exe",
    "${env:ProgramFiles}\Docker\Docker\Docker Desktop.exe",
    "${env:ProgramW6432}\Docker\Docker\Docker Desktop.exe"
)

function Start-DockerDesktop {
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            Write-Host "Starting Docker Desktop..."
            Start-Process -FilePath $path
            return $true
        }
    }
    Write-Host "Docker Desktop not found! Checked paths: $($dockerPaths -join ', ')"
    return $false
}

# Check Docker status
try {
    docker info 2>$null | Out-Null
    Write-Host "Docker is already running"
}
catch {
    Write-Host "Docker not running - Attempting to start..."
    if (-not (Start-DockerDesktop)) {
        exit 1
    }

    # Wait for Docker to initialize
    Write-Host "Waiting for Docker to start (up to 2 minutes)..."
    $timeout = 120  # seconds
    $counter = 0
    $dockerReady = $false
    
    while ($counter -lt $timeout) {
        try {
            docker info 2>$null | Out-Null
            $dockerReady = $true
            break
        }
        catch {
            Start-Sleep -Seconds 2
            $counter += 2
        }
    }

    if (-not $dockerReady) {
        Write-Host "Docker failed to start within timeout period"
        Write-Host "Please check Docker Desktop manually and try again"
        exit 1
    }
}

# Run docker-compose
Set-Location -Path $PSScriptRoot
Write-Host "Starting containers with docker-compose..."
docker-compose -f docker-compose-dev.yml up -d --build

Write-Host "`nContainers started successfully!`n"
docker-compose -f docker-compose-dev.yml ps