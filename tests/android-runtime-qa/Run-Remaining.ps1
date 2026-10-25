param([string[]]$Phases = @('calibration-seed','calibration-resume','readability','visual','modes','learning','controls','assessment','intermediate-smoke','seed','persistence'))
$ErrorActionPreference = 'Stop'
$adb = 'C:\Users\user\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$serial = 'emulator-5580'
Set-Location $PSScriptRoot
& $adb -s $serial install -r -t .\build\outputs\apk\debug\ChessVisionRuntimeQA-debug.apk
if ($LASTEXITCODE -ne 0) { throw 'QA runner installation failed' }
foreach ($phase in $Phases) {
    if ($phase -in @('calibration-resume','persistence')) {
        & $adb -s $serial shell am force-stop app.chessvision.trainer
        if ($LASTEXITCODE -ne 0) { throw 'force-stop failed' }
        Start-Sleep -Seconds 1
    }
    & $adb -s $serial shell am instrument -w -e phase $phase app.chessvision.trainer.qa/.RuntimeProbe
    if ($LASTEXITCODE -ne 0) { throw "Instrumentation failed: $phase" }
    & $adb -s $serial pull "/sdcard/Android/data/app.chessvision.trainer/files/qa-$phase.json" ".\qa-$phase.json"
    if ($LASTEXITCODE -ne 0) { throw "Report missing: $phase" }
    $report = Get-Content ".\qa-$phase.json" -Raw | ConvertFrom-Json
    if (-not $report.passed) { throw "QA phase failed: $phase" }
}


