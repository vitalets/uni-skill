# uni-skill
Универсальный адаптер на TypeScript для разработки навыков голосовых ассистентов.
Позволяет писать единый код для всех платформ.

Поддерживаются:
* Алиса
* Сбер
* Маруся

## Установка
```
npm i @uni-skill/alice @uni-skill/sber @uni-skill/marusya
```

## Использование
Пример навыка-попугая, который возвращает пользователю его фразу и рисует кнопку.
```ts
import { AliceRequest } from '@uni-skill/alice';
import { SberRequest } from '@uni-skill/sber';
import { MarusyaRequest } from '@uni-skill/marusya';

export function handler(reqBody: unknown) {
  const request = createRequest(reqBody);
  const response = request.createResponse();
  response.addVoiceText(`Вы сказали: ${request.userMessage}`);
  response.addSuggest([ 'Кнопка' ]);
  if (response.isSber()) {
    response.body.payload.emotion = { emotionId: 'oups' };
  }
  return response.body;
}

function createRequest(reqBody: unknown) {
  const request = AliceRequest.create(reqBody)
    || SberRequest.create(reqBody)
    || MarusyaRequest.create(reqBody);
  if (!request) throw new Error(`Unknown platform: ${JSON.stringify(reqBody)}`);
  return request;
}
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
