const fs = require('fs');
const path = require('path');

async function saveState() {
  const hre = require("hardhat");
  const { ethers } = hre;
  
  try {
    // Получаем текущий блок
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`Current block number: ${blockNumber}`);
    
    // Получаем информацию о блоке
    const block = await ethers.provider.getBlock(blockNumber);
    
    // Сохраняем состояние
    const state = {
      blockNumber,
      block,
      timestamp: Date.now()
    };
    
    const statePath = path.join(__dirname, '..', 'blockchain-state.json');
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    
    console.log(`State saved to ${statePath}`);
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

if (require.main === module) {
  saveState().catch(console.error);
}

module.exports = { saveState };
