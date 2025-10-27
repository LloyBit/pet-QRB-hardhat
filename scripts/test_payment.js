const { ethers } = require("ethers");

async function testPayment() {
  console.log("🚀 Тестирование платежа через внешнее подключение...");

  // 1️⃣ Подключение к ноде
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  
  // 2️⃣ Используем первый аккаунт из Hardhat (стандартный тестовый ключ)
  const wallet = new ethers.Wallet("0xac0974be79faa7f79f94c0b6e63c55c71a55b7c3b1b5b6b6b6b6b6b6b6b6b6b6b6", provider);
  
  // 3️⃣ Адрес контракта (замените на ваш актуальный)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // 4️⃣ ABI контракта
  const contractABI = [
    {
      "inputs": [
        {"internalType": "bytes32", "name": "paymentId", "type": "bytes32"},
        {"internalType": "bytes32", "name": "tariffId", "type": "bytes32"},
        {"internalType": "uint256", "name": "price", "type": "uint256"}
      ],
      "name": "payForTariff",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "name": "processedPayments",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // 5️⃣ Создание экземпляра контракта
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // 6️⃣ Генерируем тестовые данные
  const paymentId = ethers.keccak256(ethers.toUtf8Bytes("test-payment-uuid"));
  const tariffId = ethers.keccak256(ethers.toUtf8Bytes("basic-tariff"));
  const price = 100;

  console.log("🧾 paymentId:", paymentId);
  console.log("📦 tariffId:", tariffId);
  console.log("💰 price:", price);

  // 7️⃣ Генерируем calldata для сравнения
  const calldata = contract.interface.encodeFunctionData("payForTariff", [paymentId, tariffId, price]);
  console.log("🔍 Calldata:", calldata);
  console.log("🔍 Selector:", calldata.slice(0, 10));
  console.log("🔍 Calldata length:", calldata.length);

  // 8️⃣ Проверяем баланс кошелька
  const walletBalance = await provider.getBalance(wallet.address);
  console.log("💳 Баланс кошелька:", ethers.formatEther(walletBalance), "ETH");

  // 9️⃣ Отправляем транзакцию
  try {
    const tx = await contract.payForTariff(paymentId, tariffId, price, {
      value: price,
      gasLimit: 100000
    });
    
    console.log("📝 Транзакция отправлена:", tx.hash);
    
    // 🔟 Ждем подтверждения
    const receipt = await tx.wait();
    console.log("✅ Транзакция подтверждена в блоке:", receipt.blockNumber);
    
    // 1️⃣1️⃣ Проверяем статус платежа
    const compositeKey = ethers.keccak256(ethers.concat([paymentId, tariffId]));
    const isProcessed = await contract.processedPayments(compositeKey);
    console.log("✅ Платеж обработан?", isProcessed);
    
  } catch (error) {
    console.error("❌ Ошибка при отправке транзакции:", error.message);
  }
}

// Запуск теста
testPayment()
  .then(() => {
    console.log("🎉 Тест завершен");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  });