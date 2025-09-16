FROM node:22-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копируем package.json и package-lock.json
COPY package.json package-lock.json* ./

# Установка зависимостей
RUN npm ci --only=production

# Копируем остальные файлы
COPY . .

# Компиляция контрактов
RUN npm run compile

# Создаем пользователя для безопасности
RUN adduser --disabled-password --gecos '' hardhatuser && \
    chown -R hardhatuser:hardhatuser /app
USER hardhatuser

# Expose port
EXPOSE 8545

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    http://localhost:8545 || exit 1

# Запуск ноды
CMD ["npm", "run", "start"]