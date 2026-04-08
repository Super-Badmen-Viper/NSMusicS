param(
  [string]$ImageRepo = $(if ($env:NSMUSICS_DOCKER_IMAGE) { $env:NSMUSICS_DOCKER_IMAGE } else { 'xiangch007/nsmusics' }),
  [string]$ProxyUrl = $(if ($env:NSMUSICS_DOCKER_PROXY) { $env:NSMUSICS_DOCKER_PROXY } else { 'http://127.0.0.1:10808' })
)

$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location -LiteralPath $ProjectRoot

$env:HTTP_PROXY = $ProxyUrl
$env:HTTPS_PROXY = $ProxyUrl
$env:http_proxy = $ProxyUrl
$env:https_proxy = $ProxyUrl

Write-Host "[docker-win-upload] project root: $ProjectRoot"
Write-Host "[docker-win-upload] image: ${ImageRepo}:amd64-pure"

docker push "${ImageRepo}:amd64-pure"
