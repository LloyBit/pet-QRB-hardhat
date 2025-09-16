# PowerShell скрипт для остановки Hardhat ноды тестнета

Write-Host "🛑 Остановка Hardhat ноды тестнета..." -ForegroundColor Yellow

# Останавливаем контейнеры
docker-compose down

Write-Host "✅ Hardhat нода остановлена" -ForegroundColor Green
