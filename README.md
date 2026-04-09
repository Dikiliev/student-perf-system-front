# Система прогнозирования успеваемости обучающихся

Современный enterprise-grade frontend для системы прогнозирования успеваемости и выявления рисков отчисления студентов.

## Стек технологий
- **Фреймворк:** React 18, Vite
- **Язык:** TypeScript
- **Стилизация:** Tailwind CSS v4, shadcn/ui
- **Состояние:** MobX
- **Роутинг:** React Router DOM
- **API Клиент:** Axios

## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone <repository_url>
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Настройте переменные окружения:
   Скопируйте `.env.example` в `.env` и укажите корректный URL для backend API.

## Запуск в режиме разработки

```bash
npm run dev
```

Откройте `http://localhost:5173/` в вашем браузере.

## Демо аккаунты

| Роль | Логин | Пароль |
|------|-------|--------|
| Администратор | `admin_demo` | `Admin12345!` |
| Преподаватель | `teacher_demo` | `Teacher12345!` |
| Куратор | `curator_demo` | `Curator12345!` |

## Структура проекта (FSD-подобная)

- `/src/app/` — Провайдеры, стили, React Router, точка входа.
- `/src/pages/` — Основные страницы приложения (Dashboard, Students, Groups и т.д.).
- `/src/widgets/` — Самостоятельные крупные элементы UI (AppShell, Sidebar, Topbar).
- `/src/stores/` — Глобальные MobX сторы (RootStore, AuthStore, StudentsStore...).
- `/src/shared/` — Общие компоненты, константы, типы, настройка API клиента.
- `/src/components/ui/` — Компоненты базовой дизайн системы (shadcn/ui).

## Сборка для Production

```bash
npm run build
```
Готовые файлы будут в папке `dist/`.
