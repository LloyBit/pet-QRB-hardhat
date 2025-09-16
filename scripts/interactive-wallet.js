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

async function showAccounts() {
  console.log("\n👥 Доступные аккаунты:");
  const accounts = await hre.ethers.getSigners();
  
  for (let i = 0; i < accounts.length; i++) {
    const balance = await hre.ethers.provider.getBalance(accounts[i].address);
    console.log(`${i}: ${accounts[i].address} - ${hre.ethers.formatEther(balance)} ETH`);
  }
  
  return accounts;
}

async function transferFunds(sender, receiver, amount) {
  console.log(`\n💸 Перевод ${hre.ethers.formatEther(amount)} ETH...`);
  console.log(`От: ${sender.address}`);
  console.log(`К: ${receiver.address}`);

  const tx = await sender.sendTransaction({
    to: receiver.address,
    value: amount
  });

  console.log(`📝 Хеш транзакции: ${tx.hash}`);
  await tx.wait();
  console.log("✅ Перевод выполнен!");
}

async function main() {
  console.log("🏦 Интерактивный кошелек");
  console.log("========================");

  const accounts = await showAccounts();

  while (true) {
    console.log("\n📋 Выберите действие:");
    console.log("1. Показать балансы всех аккаунтов");
    console.log("2. Перевести средства");
    console.log("3. Выход");

    const choice = await askQuestion("\nВведите номер действия: ");

    switch (choice) {
      case '1':
        await showAccounts();
        break;

      case '2':
        try {
          const senderInput = await askQuestion("Введите номер отправителя (0-19) или адрес: ");
          const receiverInput = await askQuestion("Введите номер получателя (0-19) или адрес: ");
          const amountStr = await askQuestion("Введите сумму в ETH: ");

          let sender, receiver;

          // Проверяем, является ли ввод номером или адресом
          if (senderInput.match(/^[0-9]+$/)) {
            sender = accounts[parseInt(senderInput)];
          } else {
            // Ищем аккаунт по адресу
            sender = accounts.find(acc => acc.address.toLowerCase() === senderInput.toLowerCase());
          }

          if (receiverInput.match(/^[0-9]+$/)) {
            receiver = accounts[parseInt(receiverInput)];
          } else {
            // Для получателя создаем объект с адресом (для внешних кошельков)
            receiver = { address: receiverInput };
          }

          if (!sender) {
            console.log("❌ Отправитель не найден!");
            break;
          }

          if (!receiver || !receiver.address) {
            console.log("❌ Неверный адрес получателя!");
            break;
          }

          const amount = hre.ethers.parseEther(amountStr);
          await transferFunds(sender, receiver, amount);
        } catch (error) {
          console.log("❌ Ошибка при переводе:", error.message);
        }
        break;

      case '3':
        console.log("👋 До свидания!");
        rl.close();
        return;

      default:
        console.log("❌ Неверный выбор!");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  });
