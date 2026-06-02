$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Start-ServiceProcess {
    param (
        [string]$Name,
        [string]$WorkingDir,
        [string]$Command
    )

    Write-Host "Starting $Name..."
    Start-Process -FilePath "powershell" -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd `"$WorkingDir`"; $Command"
    ) -WindowStyle Normal
}

Start-ServiceProcess -Name "event-bus" -WorkingDir (Join-Path $root "event-bus") -Command "bun run dev"
Start-ServiceProcess -Name "posts" -WorkingDir (Join-Path $root "posts") -Command "bun run dev"
Start-ServiceProcess -Name "comments" -WorkingDir (Join-Path $root "comments") -Command "bun run dev"
Start-ServiceProcess -Name "moderation" -WorkingDir (Join-Path $root "moderation") -Command "bun run dev"
Start-ServiceProcess -Name "query" -WorkingDir (Join-Path $root "query") -Command "bun run dev"
Start-ServiceProcess -Name "client" -WorkingDir (Join-Path $root "client") -Command "npm run dev"

Write-Host "All services launched."
