const hre = require("hardhat");

async function main() {
  console.log("🚀 Деплой QRPaymentContract...");

  // 1️⃣ Получаем фабрику контракта
  const QRPaymentContract = await hre.ethers.getContractFactory("QRPaymentContract");

  // 2️⃣ Деплой контракта
  const qrpaymentContract = await QRPaymentContract.deploy();
  await qrpaymentContract.waitForDeployment(); // ethers v6

  console.log("✅ Контракт деплоен по адресу:", qrpaymentContract.target);

  // 3️⃣ Получаем владельца
  const owner = await qrpaymentContract.owner();
  console.log("👑 Владелец контракта:", owner);

  // 4️⃣ Получаем тестовые аккаунты
  const [payer] = await hre.ethers.getSigners();

  // 5️⃣ Генерируем тестовые UUID/хэши
  const paymentId = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("test-payment-uuid"));
  const tariffId = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("basic-tariff"));
  const price = 100 

  console.log("🧾 paymentId:", paymentId);
  console.log("📦 tariffId:", tariffId);

  // 🔍 Генерируем calldata для сравнения
  const calldata = qrpaymentContract.interface.encodeFunctionData("payForTariff", [paymentId, tariffId, price]);
  console.log("🔍 Calldata:", calldata);
  console.log("🔍 Calldata length:", calldata.length);
  console.log("🔍 Selector (first 4 bytes):", calldata.slice(0, 10));

  // 🔍 Вычисляем правильный селектор
  const functionSignature = "payForTariff(bytes32,bytes32,uint256)";
  const expectedSelector = hre.ethers.id(functionSignature).slice(0, 10);
  console.log("🔍 Expected selector:", expectedSelector);
  console.log("🔍 Selectors match:", calldata.slice(0, 10) === expectedSelector);

  // 6️⃣ Отправляем платеж
  const tx = await qrpaymentContract.connect(payer).payForTariff(paymentId, tariffId, price, {
    value: price,
  });
  await tx.wait();
  console.log("💸 Платеж успешно отправлен");

  // 7️⃣ Проверяем статус платежа через mapping (read-only)
  const compositeKey = hre.ethers.keccak256(
    hre.ethers.concat([paymentId, tariffId])
  );
  const isProcessed = await qrpaymentContract.processedPayments(compositeKey);
  console.log("✅ Платеж обработан?", isProcessed);

  // 8️⃣ Новый баланс контракта
  const newBalance = await hre.ethers.provider.getBalance(qrpaymentContract.target);
  console.log("💰 Баланс контракта:", hre.ethers.formatEther(newBalance), "ETH");
}

// Запуск скрипта
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Ошибка при деплое:", error);
    process.exit(1);
  });
