$ErrorActionPreference = 'Stop'

$rootDir = $PSScriptRoot
$services = @('event-bus', 'posts', 'comments', 'moderation', 'query')

foreach ($service in $services) {
    $serviceDir = Join-Path $rootDir $service
    $dockerfile = Join-Path $serviceDir 'Dockerfile'

    if (-not (Test-Path -Path $dockerfile -PathType Leaf)) {
        Write-Error "Skipping ${service}: Dockerfile not found."
        continue
    }

    $imageName = "blog/$service"
    Write-Host "Building $imageName from $serviceDir..."
    docker build -t $imageName $serviceDir
}

Write-Host 'All builds finished.'
