const hre = require("hardhat");

async function main() {
  console.log("💸 Простой перевод ETH между кошельками...");

  // Получаем аккаунты
  const [sender, receiver] = await hre.ethers.getSigners();
  
  console.log("👤 Отправитель:", sender.address);
  console.log("👤 Получатель:", receiver.address);

  // Получаем балансы до перевода
  const senderBalanceBefore = await hre.ethers.provider.getBalance(sender.address);
  const receiverBalanceBefore = await hre.ethers.provider.getBalance(receiver.address);

  console.log("\n💰 Балансы ДО перевода:");
  console.log(`Отправитель: ${hre.ethers.formatEther(senderBalanceBefore)} ETH`);
  console.log(`Получатель: ${hre.ethers.formatEther(receiverBalanceBefore)} ETH`);

  // Сумма для перевода
  const transferAmount = hre.ethers.parseEther("0.5"); // 0.5 ETH
  console.log(`\n💵 Переводим: ${hre.ethers.formatEther(transferAmount)} ETH`);

  // Выполняем перевод
  console.log("⏳ Выполняем перевод...");
  const tx = await sender.sendTransaction({
    to: receiver.address,
    value: transferAmount
  });

  console.log(`📝 Хеш транзакции: ${tx.hash}`);
  
  // Ждем подтверждения
  await tx.wait();
  console.log("✅ Транзакция подтверждена!");

  // Получаем балансы после перевода
  const senderBalanceAfter = await hre.ethers.provider.getBalance(sender.address);
  const receiverBalanceAfter = await hre.ethers.provider.getBalance(receiver.address);

  console.log("\n💰 Балансы ПОСЛЕ перевода:");
  console.log(`Отправитель: ${hre.ethers.formatEther(senderBalanceAfter)} ETH`);
  console.log(`Получатель: ${hre.ethers.formatEther(receiverBalanceAfter)} ETH`);

  // Вычисляем разности
  const senderDiff = senderBalanceBefore - senderBalanceAfter;
  const receiverDiff = receiverBalanceAfter - receiverBalanceBefore;

  console.log("\n📊 Изменения:");
  console.log(`Отправитель потерял: ${hre.ethers.formatEther(senderDiff)} ETH`);
  console.log(`Получатель получил: ${hre.ethers.formatEther(receiverDiff)} ETH`);

  console.log("\n✅ Перевод завершен успешно!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  });
