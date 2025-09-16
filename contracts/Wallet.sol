// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract QRPaymentContract {
    address public owner;
    
    // Маппинг для отслеживания обработанных платежей
    mapping(bytes32 => bool) public processedPayments;
    
    // Событие для логирования платежей
    event PaymentReceived(
        bytes32 indexed paymentId,
        address indexed from,
        uint256 amount,
        uint256 timestamp
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Функция для оплаты по payment_id
     * @param paymentId Уникальный ID платежа (генерируется бэкендом)
     */
    function payForTariff(bytes32 paymentId) public payable {
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(!processedPayments[paymentId], "Payment already processed");
        
        // Отмечаем платеж как обработанный
        processedPayments[paymentId] = true;
        
        // Логируем событие
        emit PaymentReceived(
            paymentId,
            msg.sender,
            msg.value,
            block.timestamp
        );
    }
    
    /**
     * @dev Функция для проверки статуса платежа
     * @param paymentId ID платежа
     * @return bool True если платеж был обработан
     */
    function isPaymentProcessed(bytes32 paymentId) public view returns (bool) {
        return processedPayments[paymentId];
    }
    
    /**
     * @dev Функция для вывода средств (только владелец)
     */
    function withdrawAll() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Функция для получения баланса контракта
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}