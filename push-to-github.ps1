param(
    [string]$Token = ""
)

$env:Path = "C:\Users\Work\git\cmd;C:\Users\Work\nodejs;" + $env:Path

if ($Token -ne "") {
    Write-Host "Pushing with provided GitHub Personal Access Token..." -ForegroundColor Cyan
    git push "https://$($Token)@github.com/prasanna2006-vk/StockMaster.git" main
} else {
    Write-Host "Pushing to GitHub (StockMaster)..." -ForegroundColor Cyan
    Write-Host "If prompted, sign in via browser or paste your GitHub Personal Access Token." -ForegroundColor Yellow
    git push -u origin main
}
