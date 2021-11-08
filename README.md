# uni-skill
Универсальный адаптер на TypeScript для разработки навыков голосовых ассистентов.
Позволяет писать единый код для всех платформ.

Поддерживаются:
* Алиса
* Сбер
* Маруся
* Алекса

## Установка
В зависимости от нужных платформ устанавливаются следующие пакеты:
```sh
# алиса
npm i @uni-skill/alice
# сбер
npm i @uni-skill/sber
# маруся
npm i @uni-skill/marusya
# алекса
npm i @uni-skill/alexa
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

## Документация
Документация по доступным свойствам и методам универсального запроса/ответа:
* [Request](p/core/src/request/types.ts)
* [Response](p/core/src/response/types.ts)

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
