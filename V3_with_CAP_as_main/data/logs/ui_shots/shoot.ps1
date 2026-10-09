$Shots = $args
# Usage: shoot.ps1 "name|url|width,height" ...   Captures each page with headless Chrome.
$out = Split-Path -Parent $MyInvocation.MyCommand.Path
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
foreach ($shot in $Shots) {
    $name, $url, $size = $shot.Split("|")
    $file = Join-Path $out "$name.png"
    if (Test-Path $file) { Remove-Item $file -Force }
    Start-Process -FilePath $chrome -ArgumentList @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--user-data-dir=$out\chrome_profile", "--window-size=$size", "--virtual-time-budget=12000", "--screenshot=$file", $url) -Wait -WindowStyle Hidden
    if (Test-Path $file) { "{0}: {1} bytes" -f $name, (Get-Item $file).Length } else { "{0}: not created" -f $name }
}
