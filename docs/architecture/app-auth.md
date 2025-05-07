#  Авторизация в приложении

## Шаги
1. Пользователь запускает игру → клиент получает `initData`.
2. Клиент отправляет `POST /auth/tma` с `initData`.
3. Сервер возвращает: `access_token`, `refresh_token`, `tg_id`.
4. Клиент подключается к WebSocket (`/ws`).
5. В течение 30 секунд после подключения клиент обязан отправить событие `auth` с `access_token`.
6. При истечении access token:
   - Отправляет `POST /auth/refresh` с `refresh_token`
   - Получает новый `access_token`
   - Вызывает `emit('refresh_token', { token })`

## Ответы WebSocket

```ts
{
  status: 'ok' | 'error',
  payload?: any,
  error?: { code: string, message: string }
}
```


```mermaid
sequenceDiagram
  participant Telegram
  participant Client
  participant HTTP_Server
  participant WebSocket

  Telegram->>Client: open Mini App with initData
  Client->>HTTP_Server: POST /auth/tma { initData }
  HTTP_Server->>Client: { access_token, refresh_token, tg_id }

  Client->>WebSocket: connect
  WebSocket->>Client: 30s auth timeout starts

  Client->>WebSocket: emit 'auth' { token }
  WebSocket->>Client: wsOk { tg_id }

  Note over Client,WebSocket: Access token valid for 15 minutes

  alt token expires
    Client->>HTTP_Server: POST /auth/refresh { refresh_token }
    HTTP_Server->>Client: { access_token, tg_id }

    Client->>WebSocket: emit 'refresh_token' { access_token }
    WebSocket->>Client: wsOk { tg_id }
  end
```