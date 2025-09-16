const fs = require('fs');
const path = require('path');

async function loadState() {
  const hre = require("hardhat");
  const { ethers } = hre;
  
  try {
    const statePath = path.join(__dirname, '..', 'blockchain-state.json');
    
    if (!fs.existsSync(statePath)) {
      console.log('No saved state found, starting fresh');
      return;
    }
    
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    console.log(`Loaded state from block ${state.blockNumber}`);
    
    // Здесь можно добавить логику для восстановления состояния
    // Например, восстановление контрактов или транзакций
    
  } catch (error) {
    console.error('Error loading state:', error);
  }
}

if (require.main === module) {
  loadState().catch(console.error);
}

module.exports = { loadState };
