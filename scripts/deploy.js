const hre = require("hardhat");

async function main() {
  console.log("🚀 Деплой тестового контракта...");

  // Получаем контракт
  const TestContract = await hre.ethers.getContractFactory("TestContract");
  
  // Деплоим контракт
  const testContract = await TestContract.deploy();
  await testContract.waitForDeployment();

  const contractAddress = await testContract.getAddress();
  
  console.log("✅ Контракт успешно задеплоен!");
  console.log(`📍 Адрес контракта: ${contractAddress}`);
  console.log(`🔗 Chain ID: ${hre.network.config.chainId}`);
  
  // Тестируем контракт
  console.log("\n🧪 Тестируем контракт...");
  
  const initialValue = await testContract.getValue();
  console.log(`📊 Начальное значение: ${initialValue}`);
  
  const owner = await testContract.getOwner();
  console.log(`👤 Владелец контракта: ${owner}`);
  
  // Устанавливаем новое значение
  const tx = await testContract.setValue(42);
  await tx.wait();
  
  const newValue = await testContract.getValue();
  console.log(`📊 Новое значение: ${newValue}`);
  
  console.log("\n✅ Тест завершен успешно!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Ошибка при деплое:", error);
    process.exit(1);
  });