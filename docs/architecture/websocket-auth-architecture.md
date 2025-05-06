# 📡 WebSocket Авторизация: Архитектура и Поведение

Документация по архитектуре WebSocket-авторизации и управления сессиями в проекте.

---

## 🔐 Авторизация (`auth`)

- Клиент подключается к серверу через WebSocket.
- В течение **30 секунд** клиент должен отправить событие `auth` с JWT токеном.
- Если токен валиден, пользователь считается авторизованным.
- При повторной авторизации:
  - предыдущая сессия отключается (`forced_disconnect`);
  - новая замещает её.

---

## ♻️ Обновление токена (`refresh_token`)

- Доступно **только для авторизованных** клиентов.
- Повторный вызов с тем же токеном не вызывает побочных эффектов (идемпотентно).
- Попытка вызвать `refresh_token` без `auth` — запрещена (`NOT_AUTHORIZED`).

---

## 🧾 Защищённые события

- Если авторизация отсутствует — возвращается `NOT_AUTHORIZED`.

---

## ❌ Замена сессии (`forced_disconnect`)

- При подключении нового клиента с тем же `tg_id`, старая сессия:
  - получает событие `forced_disconnect` с кодом `TOKEN_REPLACED`;
  - отключается через 100 мс.
- Это предотвращает мультисессию под одним аккаунтом.

---

## ⏳ AuthTimeoutService

- После подключения запускается таймер авторизации на **30 секунд**.
- Если пользователь не отправил `auth` — соединение закрывается.
- Таймер сбрасывается при успешной авторизации или `disconnect`.

---

## 📊 Статистика (`room_stats`)

- Каждые 60 секунд сервер отправляет количество авторизованных пользователей.
- Формат события: `room_stats` → `{ status: 'ok', payload: { total_lobbies: number } }`.

---

## 📦 Формат всех ответов (WsResponse)

```ts
interface WsResponse<T> {
  status: 'ok' | 'error';
  payload?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 📈 Диаграммы (Mermaid)

### Авторизация

```mermaid
sequenceDiagram
  participant Client
  participant Server

  Client->>Server: Connect via WebSocket
  Server->>Client: Start 30s auth timeout

  Client->>Server: emit 'auth' { token }
  Server->>Server: Verify token

  alt valid token
    Server->>Server: Save to connectedUsers
    Server->>Client: wsOk { tg_id }
  else invalid or expired
    Server->>Client: wsError
    Server->>Client: disconnect
  end
```

---

### Повторное подключение (forced_disconnect)

```mermaid
sequenceDiagram
  participant Client_A as Client A (старый)
  participant Client_B as Client B (новый)
  participant Server

  Client_B->>Server: emit 'auth' { token }
  Server->>Server: Detect duplicate session
  Server->>Client_A: emit 'forced_disconnect'
  Server->>Client_A: disconnect (after 100ms)
  Server->>Client_B: wsOk
```

---

### Защищённое событие

```mermaid
sequenceDiagram
  participant Client
  participant Server

  Client->>Server: emit 'profile'
  alt client.data.user is present
    Server->>Server: Handle event
    Server->>Client: wsOk { profile }
  else unauthorized
    Server->>Client: wsError { NOT_AUTHORIZED }
  end
```
