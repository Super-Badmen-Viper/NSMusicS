$env:MongoDB_DATA_VOLUME = "C:\Users\Public\Documents\NineSong\MongoDB"
$env:SQLITE_DATA_VOLUME = "C:\Users\Public\Documents\NineSong\Sqlite"
$env:METADATA_DATA_VOLUME = "C:\Users\Public\Documents\NineSong\MetaData"
$env:MUSIC_DATA_VOLUME = "E:\0_Music"

$dataDirs = @($env:MongoDB_DATA_VOLUME, $env:SQLITE_DATA_VOLUME, $env:METADATA_DATA_VOLUME, $env:MUSIC_DATA_VOLUME)
foreach ($dir in $dataDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir
    }
}

docker-compose -f docker-compose-local-init.yaml up -d