const hre = require("hardhat");

async function main() {
  console.log("🚀 Работа с QRPaymentContract...");

  // Получаем аккаунты
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  
  console.log("👤 Деплойер:", deployer.address);
  console.log("👤 Пользователь 1:", user1.address);
  console.log("👤 Пользователь 2:", user2.address);

  // Получаем балансы
  const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
  const user1Balance = await hre.ethers.provider.getBalance(user1.address);
  const user2Balance = await hre.ethers.provider.getBalance(user2.address);

  console.log("\n💰 Балансы:");
  console.log(`Деплойер: ${hre.ethers.formatEther(deployerBalance)} ETH`);
  console.log(`Пользователь 1: ${hre.ethers.formatEther(user1Balance)} ETH`);
  console.log(`Пользователь 2: ${hre.ethers.formatEther(user2Balance)} ETH`);

  // Деплоим контракт
  console.log("\n📦 Деплоим QRPaymentContract...");
  const QRPaymentContract = await hre.ethers.getContractFactory("QRPaymentContract");
  const contract = await QRPaymentContract.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`📍 Адрес контракта: ${contractAddress}`);

  // Проверяем баланс контракта
  const contractBalance = await contract.getBalance();
  console.log(`💰 Баланс контракта: ${hre.ethers.formatEther(contractBalance)} ETH`);

  // Симулируем платеж от пользователя 1
  console.log("\n💳 Симулируем платеж...");
  const paymentId = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("test-payment-123"));
  const paymentAmount = hre.ethers.parseEther("0.1"); // 0.1 ETH

  console.log(`🆔 Payment ID: ${paymentId}`);
  console.log(`💵 Сумма платежа: ${hre.ethers.formatEther(paymentAmount)} ETH`);

  // Отправляем платеж
  const tx = await contract.connect(user1).payForTariff(paymentId, { value: paymentAmount });
  await tx.wait();

  console.log("✅ Платеж успешно отправлен!");

  // Проверяем баланс контракта после платежа
  const newContractBalance = await contract.getBalance();
  console.log(`💰 Новый баланс контракта: ${hre.ethers.formatEther(newContractBalance)} ETH`);

  // Проверяем статус платежа
  const isProcessed = await contract.isPaymentProcessed(paymentId);
  console.log(`✅ Платеж обработан: ${isProcessed}`);

  // Выводим средства на адрес деплойера (владельца контракта)
  console.log("\n💸 Выводим средства...");
  const withdrawTx = await contract.withdrawAll();
  await withdrawTx.wait();

  const finalContractBalance = await contract.getBalance();
  const finalDeployerBalance = await hre.ethers.provider.getBalance(deployer.address);

  console.log(`💰 Финальный баланс контракта: ${hre.ethers.formatEther(finalContractBalance)} ETH`);
  console.log(`💰 Финальный баланс деплойера: ${hre.ethers.formatEther(finalDeployerBalance)} ETH`);

  console.log("\n✅ Все операции завершены успешно!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  });
