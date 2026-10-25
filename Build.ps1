param([string[]]$Tasks = @('assembleDebug', 'lintDebug', 'testDebugUnitTest'),[switch]$VerifyContent)
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$jdk = Join-Path $projectRoot '.tooling\jdk-17'
if (-not (Test-Path -LiteralPath (Join-Path $jdk 'bin\java.exe'))) {
    if ($env:JAVA_HOME -and (Test-Path -LiteralPath (Join-Path $env:JAVA_HOME 'bin\java.exe'))) { $jdk = $env:JAVA_HOME }
    else { throw 'JDK 17 is required. Install it or set JAVA_HOME before building.' }
}
$previousJava = $env:JAVA_HOME
$previousGradle = $env:GRADLE_USER_HOME
$previousAndroid = $env:ANDROID_USER_HOME
try {
    $env:JAVA_HOME = $jdk
    $env:GRADLE_USER_HOME = Join-Path $projectRoot '.tooling\gradle-home'
    $env:ANDROID_USER_HOME = Join-Path $projectRoot '.tooling\android-user-home'
    Push-Location $projectRoot
    try {
        if (Get-Command node -ErrorAction SilentlyContinue) {
            & node --test tests/trainer.test.cjs
            if ($LASTEXITCODE -ne 0) { throw 'Trainer tests failed' }
        }
        if ($VerifyContent) {
            & node scripts/export-intermediate-content.cjs app/build/quality
            if ($LASTEXITCODE -ne 0) { throw 'Content export failed' }
            $validatorPython = if ($env:CHESS_VALIDATOR_PYTHON) { $env:CHESS_VALIDATOR_PYTHON } else { 'python' }
            & $validatorPython scripts/validate-intermediate-content.py app/build/quality
            if ($LASTEXITCODE -ne 0) { throw 'Independent content validation failed. Install scripts/content-requirements.txt in your build Python.' }
        }
        & (Join-Path $projectRoot 'gradlew.bat') --no-daemon @Tasks
        if ($LASTEXITCODE -ne 0) { throw "Android build failed: $LASTEXITCODE" }
    } finally { Pop-Location }
} finally {
    $env:JAVA_HOME = $previousJava
    $env:GRADLE_USER_HOME = $previousGradle
    $env:ANDROID_USER_HOME = $previousAndroid
}
