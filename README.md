# Advanced Local Session
Это удобная библиотека для локального хранения сессий и глобальных настроек в боте

### 📌 Особенности:
+ Хранение сессий локально в JSON-файле
+ Простое управление глобальными настройками
+ Поддержка кэширования данных для ускорения доступа
+ Интеграция методов в ctx для удобного использования
## 🚀 Установка
```npm install advanced-local-session```
## 📌 Пример работы
```
import { Telegraf } from'telegraf';
import { AdvancedLocalSession } from 'advanced-local-session';

const bot = new Telegraf('YOUR_BOT_TOKEN');
const session = new AdvancedLocalSession({
  storagePath: './sessions.json', // Путь к файлу для хранения
  globalSettings: {
    dev_mode: false,
    admins: [123456789] // ID администраторов
  },
});

bot.use(session.middleware());

// Пример использования
bot.command('ping', (ctx) => {
  ctx.reply('🏓 Pong!');
  ctx.session.counter = (ctx.session.counter || 0) + 1;
  console.log(`Количество запросов: ${ctx.session.counter}`);
});

bot.launch();
```
## 📂 Формат sessions.json
После первого запуска в корне проекта появится файл sessions.json:
```
{
  "users": {
    "123456789": {
      "counter": 5
    }
  },
  "globals": {
    "dev_mode": false,
    "admins": [123456789]
  }
}
```
## 🔹 Методы класса AdvancedLocalSession
| Метод | Описание | Пример использования |
|----------------|:---------:|----------------:|
| middleware() | Подключает middleware в Telegraf | bot.use(session.middleware()); |
| getAllUsers() | Возвращает список всех пользователей | const users = session.getAllUsers(); |
| getUserById(id) | Получает данные пользователя по ID | const user = session.getUserById(123456789); |
| removeUser(id) | Удаляет данные пользователя | session.removeUser(123456789); |
| getGlobal(key) | Получает значение из глобальных настроек | const mode = session.getGlobal('dev_mode'); |
| setGlobal(key, v) | Устанавливает значение в глобальные настройки | session.setGlobal('dev_mode', true); |
## 🔹 Методы из контекста (ctx)
Благодаря middleware, в ctx автоматически добавляются удобные методы:
### ➡️ ctx.getGlobal(key)
Получает значение из глобальных настроек.
```
bot.command('checkmode', (ctx) => {
  const mode = ctx.getGlobal('dev_mode');
  ctx.reply(`🛠 Dev Mode: ${mode ? 'Включен' : 'Выключен'}`);
});
```
### ➡️ ctx.setGlobal(key, value)
Устанавливает значение в глобальных настройках.
```
bot.command('togglemode', (ctx) => {
  const currentMode = ctx.getGlobal('dev_mode');
  ctx.setGlobal('dev_mode', !currentMode);
  ctx.reply(`🔄 Dev Mode переключён на: ${!currentMode}`);
});
```
### ➡️ ctx.session
Работа с сессией пользователя через ctx.session.
```
bot.on('text', (ctx) => {
  ctx.session.messageCount = (ctx.session.messageCount || 0) + 1;
  ctx.reply(`💬 Вы отправили ${ctx.session.messageCount} сообщений.`);
});
```
