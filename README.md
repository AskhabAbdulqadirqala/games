# About
Веб-игра в шашки.
React + Redux + TypeScript + Vite + Tailwind + Node.js (Express, socket.io) + Jest.

![interface](./public/interface.png)

# Dev
## Запуск приложения в Docker
Необходимо иметь Make и Docker-compose:
```shell
# Запуск
make start

# Остановка
make stop

# Запуск в dev-режиме с логами
make dev
```

## Локальная сборка и тесты
Необходимо иметь Make и Node v20+:
```shell
# Установка зависимостей
make install

# Сборка
make build

# Запуск тестов
make test

# Очистка мусора
make clean
```
