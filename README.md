# Enterpreneur Assistant

Ваш персональный помощник в выборе организационно-правовой формы предприятия

## Быстрый запуск (Docker)

Убедитесь, что на вашем компьютере установлены [Git](https://git-scm.com) и [Docker](https://docker.com).

1. Клонируйте репозиторий и перейдите в папку проекта:
   ```bash
   git clone https://github.com/gorohovIlya/enterpreneur-assistant.git
   cd enterpreneur_assistant
   ```

2. Соберите и запустите контейнеры в фоновом режиме:
   ```bash
   docker compose up -d --build
   ```

3. Откройте приложение в браузере по адресу: **http://localhost**

Для остановки проекта выполните:
```bash
docker compose down
```
