const hre = require("hardhat");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log("💸 Перевод с Hardhat аккаунта на MetaMask");
  console.log("==========================================");

  // Получаем аккаунты Hardhat
  const accounts = await hre.ethers.getSigners();
  
  console.log("\n👥 Доступные Hardhat аккаунты:");
  for (let i = 0; i < 5; i++) { // Показываем первые 5
    const balance = await hre.ethers.provider.getBalance(accounts[i].address);
    console.log(`${i}: ${accounts[i].address} - ${hre.ethers.formatEther(balance)} ETH`);
  }

  // Запрашиваем адрес MetaMask
  const metamaskAddress = await askQuestion("\n🎭 Введите адрес вашего MetaMask кошелька: ");
  
  // Валидация адреса
  if (!hre.ethers.isAddress(metamaskAddress)) {
    console.log("❌ Неверный формат адреса Ethereum!");
    rl.close();
    return;
  }
  
  console.log(`\n🎭 Адрес MetaMask: ${metamaskAddress}`);
  
  // Проверяем баланс MetaMask кошелька
  const metamaskBalance = await hre.ethers.provider.getBalance(metamaskAddress);
  console.log(`💰 Баланс MetaMask: ${hre.ethers.formatEther(metamaskBalance)} ETH`);

  // Выбираем отправителя
  const senderIndex = await askQuestion("\n👤 Введите номер отправителя (0-4): ");
  const sender = accounts[parseInt(senderIndex)];
  
  if (!sender) {
    console.log("❌ Неверный номер отправителя!");
    rl.close();
    return;
  }
  
  const senderBalance = await hre.ethers.provider.getBalance(sender.address);
  console.log(`\n👤 Отправитель: ${sender.address}`);
  console.log(`💰 Баланс отправителя: ${hre.ethers.formatEther(senderBalance)} ETH`);

  // Запрашиваем сумму для перевода
  const amountStr = await askQuestion("\n💵 Введите сумму для перевода в ETH: ");
  const transferAmount = hre.ethers.parseEther(amountStr);
  
  if (senderBalance < transferAmount) {
    console.log("❌ Недостаточно средств для перевода!");
    return;
  }

  console.log(`\n💵 Переводим: ${hre.ethers.formatEther(transferAmount)} ETH`);
  console.log(`📤 От: ${sender.address}`);
  console.log(`📥 К: ${metamaskAddress}`);

  try {
    // Выполняем перевод
    console.log("\n⏳ Выполняем перевод...");
    const tx = await sender.sendTransaction({
      to: metamaskAddress,
      value: transferAmount,
      gasLimit: 21000 // Стандартный лимит для простого перевода
    });

    console.log(`📝 Хеш транзакции: ${tx.hash}`);
    console.log("⏳ Ждем подтверждения...");
    
    const receipt = await tx.wait();
    console.log(`✅ Транзакция подтверждена в блоке: ${receipt.blockNumber}`);

    // Проверяем балансы после перевода
    const newSenderBalance = await hre.ethers.provider.getBalance(sender.address);
    const newMetamaskBalance = await hre.ethers.provider.getBalance(metamaskAddress);

    console.log("\n💰 Балансы ПОСЛЕ перевода:");
    console.log(`Отправитель: ${hre.ethers.formatEther(newSenderBalance)} ETH`);
    console.log(`MetaMask: ${hre.ethers.formatEther(newMetamaskBalance)} ETH`);

    console.log("\n✅ Перевод успешно завершен!");
    console.log("🎉 Проверьте ваш MetaMask кошелек!");

  } catch (error) {
    console.error("❌ Ошибка при переводе:", error.message);
  } finally {
    rl.close();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  });
