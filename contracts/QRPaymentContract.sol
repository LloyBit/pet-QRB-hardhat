// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract QRPaymentContract {
    address public owner;
    
    // Маппинг для проверки, был ли уже оплачен данный paymentId + tariffId
    mapping(bytes32 => bool) public processedPayments;

    // Событие для логирования платежей
    event PaymentReceived(
        bytes32 indexed paymentId,
        bytes32 indexed tariffId,
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
     * @dev Основная функция оплаты.
     * @param paymentId Уникальный UUID платежа (генерируется на бэке)
     * @param tariffId  UUID тарифа (привязан к тарифу пользователя)
     * @param price     Ожидаемая сумма оплаты в wei
     */
    function payForTariff(bytes32 paymentId, bytes32 tariffId, uint256 price) public payable {
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(msg.value == price, "Incorrect payment amount");

        // Создаем уникальный ключ на основе paymentId и tariffId
        bytes32 compositeKey = keccak256(abi.encodePacked(paymentId, tariffId));

        require(!processedPayments[compositeKey], "Payment already processed");

        // Отмечаем платеж как обработанный
        processedPayments[compositeKey] = true;

        // Логируем событие
        emit PaymentReceived(
            paymentId,
            tariffId,
            msg.sender,
            msg.value,
            block.timestamp
        );
    }

    /**
     * @dev Вывод всех средств (только владелец)
     */
    function withdrawAll() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Получение текущего баланса контракта
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}