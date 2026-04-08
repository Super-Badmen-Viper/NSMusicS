param()
Write-Host "[win] packaging script wrapper"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Resolve-Path "$ScriptDir\..\..\.."
Set-Location $ProjectRoot
Write-Host "[win] project root: $ProjectRoot"
npm run build
