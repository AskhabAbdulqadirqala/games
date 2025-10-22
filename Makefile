# Цвета для вывода
GREEN = \033[0;32m
NC = \033[0m # No Color

install:
	echo "$(GREEN)Установка зависимостей для фронтенда...$(NC)"
	npm install
	echo "$(GREEN)Установка зависимостей для бэкенда...$(NC)"
	cd server && npm install

# Запуск в Docker
start:
	@echo "$(GREEN)Запуск приложения в Docker...$(NC)"
	docker-compose up --build -d
	@echo "$(GREEN)Приложение запущено:$(NC)"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend: http://localhost:3001"

# Остановка Docker
stop:
	@echo "$(GREEN)Остановка контейнеров...$(NC)"
	docker-compose down

# Сборка проекта
build:
	@echo "$(GREEN)Сборка фронтенда...$(NC)"
	npm run build
	@echo "$(GREEN)Сборка бэкенда...$(NC)"
	cd server && npm run build

# Запуск тестов
test:
	@echo "$(GREEN)Запуск тестов...$(NC)"
	npm test

# Локальная разработка
dev:
	@echo "$(GREEN)Запуск в режиме разработки...$(NC)"
	docker-compose up --build

# Очистка
clean:
	@echo "$(GREEN)Очистка...$(NC)"
	rm -rf node_modules
	rm -rf server/node_modules
	rm -rf dist
	rm -rf server/dist
	docker-compose down -v

# Логи
logs:
	@echo "$(GREEN)Просмотр логов...$(NC)"
	docker-compose logs -f

# Помощь
help:
	@echo "$(GREEN)Доступные команды:$(NC)"
	@echo "make install  - Установка зависимостей"
	@echo "make start	- Запуск в Docker"
	@echo "make stop	 - Остановка контейнеров"
	@echo "make build	- Сборка проекта"
	@echo "make test	 - Запуск тестов"
	@echo "make dev	  - Запуск в режиме разработки"
	@echo "make clean	- Очистка проекта"
	@echo "make logs	 - Просмотр логов"