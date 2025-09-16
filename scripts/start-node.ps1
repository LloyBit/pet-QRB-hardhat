# PowerShell script for starting Hardhat testnet node

Write-Host "Starting Hardhat testnet node..." -ForegroundColor Green

# Check if Docker network exists
$networkExists = docker network ls | Select-String "qrb-network"
if (-not $networkExists) {
    Write-Host "Network qrb-network not found. Creating..." -ForegroundColor Yellow
    docker network create qrb-network
} else {
    Write-Host "Network qrb-network already exists" -ForegroundColor Green
}

# Stop existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Build and start containers
Write-Host "Building and starting Hardhat node..." -ForegroundColor Yellow
docker-compose up --build -d

# Wait for node startup
Write-Host "Waiting for node startup..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check status
$containerStatus = docker-compose ps | Select-String "Up"
if ($containerStatus) {
    Write-Host "Hardhat node successfully started!" -ForegroundColor Green
    Write-Host "RPC URL: http://localhost:8545" -ForegroundColor Cyan
    Write-Host "Chain ID: 1337" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available accounts:" -ForegroundColor Yellow
    Write-Host "   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" -ForegroundColor White
    Write-Host "   Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8" -ForegroundColor White
    Write-Host "   Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" -ForegroundColor White
    Write-Host ""
    Write-Host "Private keys (for testing only!):" -ForegroundColor Yellow
    Write-Host "   Account #0: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" -ForegroundColor White
    Write-Host "   Account #1: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" -ForegroundColor White
    Write-Host "   Account #2: 0x5de4111daa5ba4e0b23975c70d90abd0921ef9c4b4b69759b17e0368b8d871d0" -ForegroundColor White
    Write-Host ""
    Write-Host "To stop the node, run: .\scripts\stop-node.ps1" -ForegroundColor Cyan
} else {
    Write-Host "Error starting node. Check logs:" -ForegroundColor Red
    docker-compose logs
}