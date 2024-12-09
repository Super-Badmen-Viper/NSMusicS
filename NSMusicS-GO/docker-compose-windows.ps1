$os = $env:OS

if ($os -eq "windows") {
    $dataDir = "C:\Users\Public\Documents\NSMusicS-GO"
    if (-not (Test-Path $dataDir)) {
        New-Item -ItemType Directory -Path $dataDir
    }
    $env:DATA_VOLUME = $dataDir
}

docker-compose up -d