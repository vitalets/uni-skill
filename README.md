# uni-skill
Универсальный адаптер на TypeScript для разработки навыков голосовых ассистентов.
Позволяет писать единый код для всех платформ.

Поддерживаются:
* Алиса
* Сбер
* Маруся

## Использование
Пример навыка-попугая, который возвращает пользователю его фразу и рисует кнопку.
```ts
import { createRequest, createResponse } from 'uni-skill';

function handler(reqBody: unknown) {
  const request = createRequest(reqBody);
  const response = createResponse(request);
  response.addVoiceBubble(`Вы сказали: ${request.userMessage}`);
  response.addSuggest([ 'Кнопка' ]);
  if (response.isSber()) {
    response.body.payload.emotion = { emotionId: 'oups' };
  }
  return response.body;
}
```

## Установка
```
npm i uni-skill
```

## Свойства и методы
* [Request](src/common/request.ts)
* [Response](src/common/response.ts)

## Специфика платформ
Для добавления платформо-зависимых элементов, нужно занести код под соответствующий if.
Под if-ом работают typeguard-ы для нужной платформы, что удобно.
```ts
if (response.isSber()) {
  response.body.payload.emotion = { emotionId: 'oups' };
}
```

## Лицензия
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
